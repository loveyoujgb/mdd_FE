import React, { Dispatch, SetStateAction, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";

import { calcRem, fontTheme } from "../../styles/theme";
import { darkTheme, lightTheme } from "../../styles/colors";

import { numberFormat } from "../../utils/numberFormat";
import { logClickEvent } from "../../utils/googleAnalytics";
import { getLoc } from "../../utils/localStorage";

import { postUserLike } from "../../api/memberApi";
import { lightThemeState } from "../../state/atom";
import { MemberType } from "../../types/memberTypes";

import { ReactComponent as Like } from "../../assets/svg/like.svg";
import { ReactComponent as Share } from "../../assets/svg/share.svg";
import { ReactComponent as AllDisk } from "../../assets/svg/all_disk.svg";
import { ReactComponent as GuideIcon } from "../../assets/svg/guide.svg";

import Button from "../elements/Button";

interface HomeBottomProps {
  data: MemberType;
  setOpenGuidemodal: Dispatch<SetStateAction<boolean>>;
  like: number;
  setLike: Dispatch<SetStateAction<number>>;
}

const HomeBottom = ({
  data,
  setOpenGuidemodal,
  like,
  setLike,
}: HomeBottomProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [likeView, setLikeView] = useState<JSX.Element[]>([]);
  const memberId = getLoc("memberId");
  const isLightTheme = useRecoilValue(lightThemeState);

  const handleShare = () => {
    // 공유하기 클릭
    logClickEvent({
      action: "SHARE_BUTTON",
      category: "home",
      label: "Click Share Button",
    });

    const nickname = getLoc("nickname");
    if (navigator.share) {
      navigator
        .share({
          title: "My Digging Disk",
          text: `${nickname} 님의 디깅디스크 보러갈래요? 💾\n`,
          url: `/home/${memberId}`,
        })
        .then(() => {})
        .catch(() => {});
    } else {
      const url = `${nickname} 님의 디깅디스크 보러갈래요? 💾\nhttps://mydiggingdisk.com/home/${memberId}`;
      navigator.clipboard
        .writeText(url)
        .then(() => {
          alert("공유 링크가 복사되었습니다.");
        })
        .catch(() => {});
    }
  };

  const { mutate: mutationUserLike } = useMutation(
    () => postUserLike(id as string),
    {
      onSuccess(res) {
        setLike(res);
        const likeViewCopy = [...likeView];
        const newKey = Date.now();
        likeViewCopy.push(
          <LikeIcon key={newKey}>
            <Like />
          </LikeIcon>
        );
        setLikeView(likeViewCopy);
        setTimeout(() => {
          likeViewCopy.pop();
          setLikeView(likeViewCopy);
        }, 500);
        setTimeout(() => {
          setLikeView([]);
        }, 10000);
      },
    }
  );

  return (
    <>
      {data.isMe ? (
        <StBottomContainer
          color={
            isLightTheme ? lightTheme.colors.primary02 : darkTheme.colors.text02
          }
        >
          <div onClick={handleShare}>
            <Share />
            <span>홈 공유하기</span>
          </div>

          <div onClick={() => navigate(`/disk-list/${memberId}`)}>
            <AllDisk />
            <span>전체 디깅디스크</span>
          </div>
          <div
            onClick={() => {
              setOpenGuidemodal(true);
              // 홈 - 디깅디스크 사용법
              logClickEvent({
                action: "GUIDE_MODAL",
                category: "home",
                label: "Open Guide Modal",
              });
            }}
          >
            <GuideIcon />
            <span>{`디깅디스크\n사용법`}</span>
          </div>
        </StBottomContainer>
      ) : (
        <StButtonContainer>
          <Button
            btnStatus={"primary01"}
            clickHandler={() => {
              mutationUserLike();
            }}
          >
            <StButtonText>
              <Like fill={lightTheme.colors.white} />
              {likeView}
              <span>{numberFormat(like)}</span>
            </StButtonText>
          </Button>
        </StButtonContainer>
      )}
    </>
  );
};

export default HomeBottom;

const StBottomContainer = styled.div`
  width: 100%;
  gap: ${calcRem(8)};
  display: flex;
  align-items: top;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 ${calcRem(17)};
  div {
    cursor: pointer;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: ${calcRem(12)};
  }
  span {
    white-space: pre-line;
    text-align: center;
    font-family: "NanumSquareNeo";
    color: ${({ color }) => color};
    line-height: ${fontTheme.display01.lineHeight};
    letter-spacing: ${fontTheme.display01.letterSpacing};
    font-size: ${fontTheme.display01.fontSize};
    font-weight: ${fontTheme.display01.fontWeight};
  }
`;

const StButtonContainer = styled.div`
  min-width: 139px;
  margin-top: ${calcRem(8)};
`;

const floatAnimation = keyframes`
  0% {
    opacity: 1;
    fill:${lightTheme.colors.white};
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    opacity: 0;
    fill: transparent;
    transform: translateY(-20px);
  }
`;

const LikeIcon = styled.div`
  position: absolute;
  svg {
    fill: transparent;
    cursor: pointer;
    animation: ${floatAnimation} 1s ease-in-out;
  }
`;

const StButtonText = styled.div`
  svg {
    width: 24px;
    height: 24px;
  }

  position: relative;
  display: flex;
  align-items: center;
  gap: ${calcRem(8)};
`;
