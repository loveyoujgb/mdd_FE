import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

import { unregisterToastState } from "../state/atom";
import { logClickEvent } from "../utils/googleAnalytics";

import AppLayout from "../components/layout/AppLayout";
import Button from "../components/elements/Button";
import Guide from "../components/Guide";
import ToastModal from "../components/elements/ToastModal";

import { calcRem, MOBILE_MAX_W } from "../styles/theme";
import { lightTheme } from "../styles/colors";

import LogoMDDSimple from "../assets/img/logo_mdd_simple.png";
import MonitorEmpty from "../assets/img/monitor_empty.png";
import DiskMask01 from "../assets/img/disk_mask_1.png";
import DiskMask02 from "../assets/img/disk_mask_2.png";

const MONITOR_TEXT =
  "당신의 디깅디스크를\n만들어드리는 MDD에 오신것을\n환영합니다.";

export type StCurcorType = {
  status: boolean;
};

const LandingPage = () => {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currentIcon, setCurrentIcon] = useState(DiskMask01);
  const [displayText, setDisplayText] = useState<string[]>([]);
  const [cursurStatus, setCursurStatus] = useState<boolean>(false);

  const [openUnregisterToast, setOpenUnregisterToast] =
    useRecoilState(unregisterToastState);

  useEffect(() => {
    setTimeout(() => {
      if (openUnregisterToast) setOpenUnregisterToast(false);
    }, 2000);
  }, [openUnregisterToast]);

  setTimeout(() => {
    setCursurStatus(true);
  }, 10300);

  let currentIndex = 0;
  let currentLine = 0;

  useEffect(() => {
    // ui 지연 setTimeout
    const timeoutId = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayText((prev) => {
          const currentArray = [...prev];
          const currentText = prev[currentLine] ? prev[currentLine] : "";
          currentArray[currentLine] =
            currentText + MONITOR_TEXT[currentIndex++];
          if (MONITOR_TEXT[currentIndex] === "\n") {
            currentLine++;
            currentIndex++;
          }

          if (currentArray.join().length >= MONITOR_TEXT.length) {
            clearInterval(interval);
            clearInterval(intervalId);
            setCurrentIcon(DiskMask01);
          }
          return currentArray;
        });
      }, 60);

      const intervalId = setInterval(() => {
        setCurrentIcon((currentIcon) =>
          currentIcon === DiskMask01 ? DiskMask02 : DiskMask01
        );
      }, 200);

      return () => {
        clearInterval(interval);
        clearInterval(intervalId);
      };
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <AppLayout>
      <StContainer>
        <StLogo src={LogoMDDSimple} />
        <StMonitorContainer>
          <StMonitor src={MonitorEmpty} />
          <StMonitorBox>
            <StDiskMask src={currentIcon} />
            {displayText.map((item, index) => (
              <StDiskTextContainer key={`${item}_${index}`}>
                <StDiskText>{item}</StDiskText>
                {displayText.length === index + 1 && (
                  <StCursor className="cursor" status={cursurStatus}></StCursor>
                )}
              </StDiskTextContainer>
            ))}
          </StMonitorBox>
        </StMonitorContainer>
        <StButton>
          <Button
            className="guide-modal"
            btnStatus="primary02"
            clickHandler={() => {
              setModalOpen(true);
              // 랜딩 - 디깅디스크 사용법
              logClickEvent({
                action: "GUIDE_MODAL",
                category: "landing",
                label: "Open Guide Modal",
              });
            }}
          >
            <span>그게 뭔데?</span>
          </Button>
          <Button
            btnStatus="primary01"
            clickHandler={() => {
              navigate("/signUp");
            }}
          >
            <span>디스크 만들어줘</span>
          </Button>
        </StButton>
        <StLoginText
          onClick={() => {
            navigate("/login");
          }}
        >
          로그인 하기
        </StLoginText>
      </StContainer>
      <Guide modalOpen={modalOpen} setModalOpen={setModalOpen} />
      {openUnregisterToast ? (
        <ToastModal>
          <span>회원 탈퇴 처리가 완료됐어요.</span>
        </ToastModal>
      ) : (
        <></>
      )}
    </AppLayout>
  );
};

export default LandingPage;

const StContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.bg};
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* justify-content: space-around; */
  align-items: center;
`;

const StLogo = styled.img`
  width: 129px;
  height: auto;
  padding: ${calcRem(77)} 0 ${calcRem(24)} 0;

  @media screen and (max-width: ${MOBILE_MAX_W}px) {
    padding: ${calcRem(39)} 0 ${calcRem(24)} 0;
  }

  @media screen and (max-height: 675px) {
    padding: ${calcRem(39)} 0 ${calcRem(24)} 0;
  }
`;

const StMonitorContainer = styled.div`
  position: relative;
`;
const StMiddleContainer = styled.div`
  /* position: relative; */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StMonitor = styled.img`
  width: 344px;
  height: auto;
  @media screen and (max-width: ${MOBILE_MAX_W}px) {
    width: 100%;
    padding: 0 ${calcRem(23)};
  }
`;

const StMonitorBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  height: 120px;
`;

const StDiskMask = styled.img`
  width: 44px;
  height: auto;
  margin-bottom: ${calcRem(15)};
`;

const StDiskTextContainer = styled.div`
  display: inline-flex;
  flex-direction: row;
`;

const StDiskText = styled.span`
  color: ${({ theme }) => theme.colors.primary01};
  font-size: ${calcRem(16)};
  font-style: normal;
  font-weight: 500;
  text-align: center;
  /* line-height: ${calcRem(16)}; */
  letter-spacing: 0.15px;
  margin-bottom: ${calcRem(4)};
`;

const blink = keyframes`
  50% {
    border-right-color: transparent;
  }
`;

const StCursor = styled.span<StCurcorType>`
  display: inline-block;
  animation: ${blink} 1s step-end infinite;
  height: 17px;
  border-right: 2px solid
    ${({ status }) => (status ? "transparent" : lightTheme.colors.text01)};
  position: relative;
  right: 1px;
`;

const StButton = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${calcRem(8)};
  padding: ${calcRem(84)} ${calcRem(122)} ${calcRem(32)} ${calcRem(122)};
  width: 100%;
  @media screen and (max-width: ${MOBILE_MAX_W}px) {
    padding: ${calcRem(84)} ${calcRem(16)} ${calcRem(32)} ${calcRem(16)};
  }
  @media screen and (max-height: 675px) {
    padding: ${calcRem(44)} ${calcRem(16)} ${calcRem(32)} ${calcRem(16)};
  }
`;

const StLoginText = styled.span`
  padding-bottom: ${calcRem(27)};
  color: ${({ theme }) => theme.colors.primary01};
  font-size: ${calcRem(16)};
  font-style: normal;
  font-weight: 700;
  line-height: ${calcRem(17)};
  letter-spacing: 1.35px;
  text-decoration-line: underline;
  cursor: pointer;
`;
