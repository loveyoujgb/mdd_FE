import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { calcRem, fontTheme } from "../../styles/theme";
import { darkTheme, lightTheme } from "../../styles/colors";

import { DiskType } from "../../types/diskTypes";
import { UserBookbarkDataType } from "../../types/memberTypes";
import { lightThemeState } from "../../state/atom";
import { logClickEvent } from "../../utils/googleAnalytics";

import { ReactComponent as Plus } from "../../assets/svg/plus.svg";
import { ReactComponent as Bookmark } from "../../assets/svg/bookmark.svg";

import Disk from "../elements/Disk";

interface HomeUserDIskListProps {
  bookmarkData: UserBookbarkDataType;
  setOpenDiskModal: Dispatch<SetStateAction<boolean>>;
  setTargetDisk: Dispatch<SetStateAction<number>>;
}

const HomeUserDIskList = ({
  bookmarkData,
  setOpenDiskModal,
  setTargetDisk,
}: HomeUserDIskListProps) => {
  const isLightTheme = useRecoilValue(lightThemeState);
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <StDiskContainer
      color={isLightTheme ? lightTheme.colors.white : darkTheme.colors.bg}
    >
      <StTopBox>
        <StDiskText
          color={isLightTheme ? darkTheme.colors.bg : lightTheme.colors.white}
        >
          대표 디스크
        </StDiskText>
        {bookmarkData.isMine ? (
          <Plus
            onClick={() => {
              // 디스크 생성하기
              logClickEvent({
                action: "NEW_DISK",
                category: "home",
                label: "Click New Disk Button",
              });
              navigate("/new-disk", { state: "newDisk" });
            }}
            width="24px"
            height="24px"
          />
        ) : (
          <StMoreText onClick={() => navigate(`/disk-list/${id}`)}>
            더보기
          </StMoreText>
        )}
      </StTopBox>

      {bookmarkData && bookmarkData.diskList.length > 0 ? (
        <StDiskBoxFlex
          color={isLightTheme ? darkTheme.colors.bg : lightTheme.colors.white}
        >
          {bookmarkData.diskList.map((item: DiskType) => (
            <StDiskBox
              onClick={() => {
                setOpenDiskModal(true);
                setTargetDisk(item.diskId);
                // 디스크 상세보기
                logClickEvent({
                  action: "DISK_CARD_VIEW",
                  category: "home",
                  label: "View Disk Card",
                });
              }}
              key={item.diskId}
            >
              <Bookmark width="22px" height="22px" />
              <Disk diskColor={item.diskColor} />
              <span>{item.diskName}</span>
            </StDiskBox>
          ))}
        </StDiskBoxFlex>
      ) : (
        <StEmptyDisk
          color={
            isLightTheme ? lightTheme.colors.primary02 : lightTheme.colors.white
          }
        >
          <span>대표디스크가 없어요.</span>
        </StEmptyDisk>
      )}
    </StDiskContainer>
  );
};

export default HomeUserDIskList;

const StDiskBoxFlex = styled.div`
  color: ${({ color }) => color};
  width: 100%;
  gap: ${calcRem(12)};
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

const StEmptyDisk = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    color: ${({ color }) => color};
    line-height: ${fontTheme.display01.lineHeight};
    letter-spacing: ${fontTheme.display01.letterSpacing};
    font-size: ${fontTheme.display01.fontSize};
    font-weight: ${fontTheme.display01.fontWeight};
  }
`;

const StDiskContainer = styled.div`
  margin: ${calcRem(16)} 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${calcRem(16)};
  padding: ${calcRem(24)} ${calcRem(16)};
  border-radius: 12px;
  background-color: ${({ color }) => color};
  border: 2px solid ${({ theme }) => theme.colors.primary01};
`;

const StTopBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  svg {
    cursor: pointer;
  }
`;

const StDiskText = styled.span`
  font-family: "NanumSquareNeo";
  color: ${({ color }) => color};
  line-height: ${fontTheme.display01.lineHeight};
  letter-spacing: ${fontTheme.display01.letterSpacing};
  font-size: ${fontTheme.display01.fontSize};
  font-weight: ${fontTheme.display01.fontWeight};
`;

const StMoreText = styled.span`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary01};
  line-height: ${fontTheme.button.lineHeight};
  letter-spacing: ${fontTheme.button.letterSpacing};
  font-size: ${fontTheme.button.fontSize};
  font-weight: ${fontTheme.button.fontWeight};
`;

const StDiskBox = styled.div`
  cursor: pointer;
  border-radius: 8px;
  padding: ${calcRem(8)};
  width: 100%;
  height: auto;
  background-color: ${({ theme }) => theme.colors.bg};
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  gap: ${calcRem(8)};
  img {
    width: 60px;
    height: auto;
  }
  svg {
    position: absolute;
    left: 8px;
    top: 0;
  }
  span {
    color: ${({ color }) => color};
    text-align: center;
    line-height: ${fontTheme.caption.lineHeight};
    letter-spacing: ${fontTheme.caption.letterSpacing};
    font-size: ${fontTheme.caption.fontSize};
    font-weight: ${fontTheme.caption.fontWeight};
  }
`;
