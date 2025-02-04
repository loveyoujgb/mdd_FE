import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";

import { MOBILE_MAX_W, calcRem, fontTheme } from "../../styles/theme";

import { NewDiskProps } from "../../pages/NewDiskPage";
import Button from "../elements/Button";
import Input from "../elements/Input";
import { newDiskState, newDiskStepState } from "../../state/atom";
import { DISK_NAME_MAX_LENGTH } from "../../utils/validations";
import { DISK_COLOR_LIST } from "../../types/diskTypes";
import { InputStatusType } from "../../types/etcTypes";

import { ReactComponent as Dice } from "../../assets/svg/dice.svg";
import DiskCarousel from "./DiskCarousel";
import { getRandomName } from "../../utils/getRandomName";
import { getLoc } from "../../utils/localStorage";

const NewDiskCover = ({ titleText }: NewDiskProps) => {
  const [diskNum, setDiskNum] = useState<number>(0);
  const [diskName, setDiskName] = useState<string>("");
  const [inputStatus, setInputStatus] = useState<InputStatusType>("default");

  const [step, setStep] = useRecoilState(newDiskStepState);
  const [newDisk, setNewDisk] = useRecoilState(newDiskState);

  const navigate = useNavigate();

  useEffect(() => {
    setDiskNum(DISK_COLOR_LIST.indexOf(newDisk.diskColor));
    setDiskName(newDisk.diskName ? newDisk.diskName : "");
  }, []);

  const handleNext = () => {
    setNewDisk((newDisk) => ({
      ...newDisk,
      diskName,
      diskColor: DISK_COLOR_LIST[diskNum],
    }));
    setStep((prev) =>
      prev === "newDiskSignUp1" ? "newDiskSignUp2" : "newDisk2"
    );
  };

  return (
    <StContainer>
      <h2>{titleText}</h2>
      <StCarouselContainer>
        <DiskCarousel disk={newDisk} setDiskNum={setDiskNum} />
      </StCarouselContainer>
      <StInputContainer>
        <Input
          labelText="디스크 이름"
          bottomText="직접 수정할 수 있어요"
          value={diskName}
          setValue={setDiskName}
          status={inputStatus}
          setStatus={setInputStatus}
          placeholder="상반기 최애 아이돌 Top4 ⸜( ˙ ˘ ˙)⸝♡"
          maxLength={DISK_NAME_MAX_LENGTH}
          TopChildren={
            <StRandomBtn onClick={() => setDiskName(getRandomName())}>
              <span>랜덤추천</span>
              <Dice />
            </StRandomBtn>
          }
          inputId="disk-name"
        ></Input>
      </StInputContainer>
      <StBtnContainer>
        <Button
          btnStatus={diskName.length ? "primary01" : "disabled"}
          disabled={!diskName.length}
          clickHandler={() => handleNext()}
        >
          <span>{step === "newDiskSignUp1" ? "다음" : "디스크 생성하기"}</span>
        </Button>
        <StSkipBtn>
          {step === "newDiskSignUp1" ? (
            <Button
              btnStatus="transparent"
              clickHandler={() =>
                window.location.replace(`/home/${getLoc("memberId")}`)
              }
            >
              <span>나중에 만들기</span>
            </Button>
          ) : (
            <></>
          )}
        </StSkipBtn>
      </StBtnContainer>
    </StContainer>
  );
};

export default NewDiskCover;

const StContainer = styled.div`
  min-height: calc(100vh - 50px);
  padding-top: ${calcRem(50)};
  background-color: ${({ theme }) => theme.colors.bg};

  h2 {
    padding: ${calcRem(24)} ${calcRem(16)};
    white-space: pre-wrap;
    color: ${({ theme }) => theme.colors.text01};
    text-align: center;
    line-height: ${fontTheme.display02.lineHeight};
    letter-spacing: ${fontTheme.display02.letterSpacing};
    font-family: "NanumSquareNeo";
    font-size: ${fontTheme.display02.fontSize};
    font-weight: ${fontTheme.display02.fontWeight};
  }
`;

const StCarouselContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${calcRem(42)} ${calcRem(42)} ${calcRem(56)};
`;

const StInputContainer = styled.div`
  width: 100%;
  padding: 0 ${calcRem(32)} ${calcRem(60)};

  @media screen and (max-width: ${MOBILE_MAX_W}px) {
    padding: 0 ${calcRem(16)} ${calcRem(60)};
  }
`;

const StRandomBtn = styled.button`
  display: flex;
  align-items: center;
  gap: ${calcRem(4)};

  span {
    color: ${({ theme }) => theme.colors.text02};
    line-height: ${fontTheme.body02.lineHeight};
    letter-spacing: ${fontTheme.body02.letterSpacing};
    font-size: ${fontTheme.body02.fontSize};
    font-weight: ${fontTheme.body02.fontWeight};
  }
`;

const StBtnContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: ${calcRem(32)};
  padding: 0 ${calcRem(32)};

  @media screen and (max-width: ${MOBILE_MAX_W}px) {
    padding: 0 ${calcRem(16)};
  }
`;

const StSkipBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
