import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";

import { darkTheme, lightTheme } from "../../styles/colors";
import { calcRem, fontTheme } from "../../styles/theme";

import { MemberType } from "../../types/memberTypes";
import { numberFormat } from "../../utils/numberFormat";
import { lightThemeState } from "../../state/atom";

import DefaultProfile from "../../assets/img/default_profile.png";
import { ReactComponent as Like } from "../../assets/svg/like.svg";
import { ReactComponent as Edit } from "../../assets/svg/edit.svg";

interface HomeUserInfoProps {
  data: MemberType;
  setOpenProfileModal: Dispatch<SetStateAction<boolean>>;
  like: number;
}

const HomeUserInfo = ({
  data,
  setOpenProfileModal,
  like,
}: HomeUserInfoProps) => {
  const isLightTheme = useRecoilValue(lightThemeState);

  return (
    <StProfileContainer
      color={isLightTheme ? lightTheme.colors.white : darkTheme.colors.bg}
    >
      {data.isMe && (
        <StEditBox onClick={() => setOpenProfileModal(true)}>
          <Edit />
        </StEditBox>
      )}

      <StProfileImage
        src={data.profileImg ? data.profileImg : DefaultProfile}
        alt="profile"
      />
      <StProfileText color={lightTheme.colors.primary01}>
        {data.nickname}
      </StProfileText>
      <StRowFlexText>
        <span color={lightTheme.colors.text02}>{data.interest}</span>
        <span color={lightTheme.colors.text02}>
          {data.interest && " 디깅 중"}
        </span>
      </StRowFlexText>
      <StProfileText
        color={isLightTheme ? lightTheme.colors.text01 : darkTheme.colors.white}
      >
        {data.introduce}
      </StProfileText>
      <StVisitLike>
        <span>방문 {numberFormat(data.visitCount)}</span>
        {data.isMe && (
          <>
            <Like
              fill={
                isLightTheme
                  ? lightTheme.colors.text02
                  : darkTheme.colors.text02
              }
            />
            <span>좋아요 {numberFormat(like)}</span>
          </>
        )}
      </StVisitLike>
    </StProfileContainer>
  );
};

export default HomeUserInfo;

const StProfileContainer = styled.div`
  width: 100%;
  display: flex;
  padding: ${calcRem(24)} ${calcRem(16)};
  border-radius: 12px;
  background-color: ${({ color }) => color};
  border: 2px solid ${({ theme }) => theme.colors.primary01};
  flex-direction: column;
  align-items: center;
  gap: ${calcRem(8)};
  position: relative;
`;

const StProfileText = styled.span`
  text-align: center;
  font-family: "NanumSquareNeo";
  color: ${({ color }) => color};
  line-height: ${fontTheme.display01.lineHeight};
  letter-spacing: ${fontTheme.display01.letterSpacing};
  font-size: ${fontTheme.display01.fontSize};
  font-weight: ${fontTheme.display01.fontWeight};
`;

const StRowFlexText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  span {
    text-align: center;
    font-family: "NanumSquareNeo";
    color: ${lightTheme.colors.text02};
    line-height: ${fontTheme.display01.lineHeight};
    letter-spacing: ${fontTheme.display01.letterSpacing};
    font-size: ${fontTheme.display01.fontSize};
  }
  span:nth-child(1) {
    font-weight: ${fontTheme.display01.fontWeight};
    white-space: pre-line;
  }
  span:nth-child(2) {
    font-weight: ${fontTheme.headline01.fontWeight};
    white-space: pre;
  }
`;

const StVisitLike = styled.div`
  display: flex;
  align-items: center;
  gap: ${calcRem(4)};

  span {
    text-align: center;
    color: ${({ theme }) => theme.colors.text02};
    line-height: ${fontTheme.caption.lineHeight};
    letter-spacing: ${fontTheme.caption.letterSpacing};
    font-size: ${fontTheme.caption.fontSize};
    font-weight: ${fontTheme.caption.fontWeight};
  }
  svg {
    margin-left: ${calcRem(8)};
    width: 16px;
    height: 16px;
  }
`;

const StProfileImage = styled.img`
  width: 69px;
  height: 69px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.primary01};
  object-fit: cover;
`;

const StEditBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 0px 12px 0px 4px;
  top: -2px;
  right: -2px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.primary01};
  svg {
    width: 24px;
    height: 24px;
  }
`;
