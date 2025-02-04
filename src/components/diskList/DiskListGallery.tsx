import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import { DiskListProps } from "../../pages/DiskListPage";
import ModalLayout from "../layout/ModalLayout";
import DiskCard from "./DiskCard";
import Disk from "../elements/Disk";
import Button from "../elements/Button";
import { newDiskStepState } from "../../state/atom";
import { logClickEvent } from "../../utils/googleAnalytics";
import { DiskColorType, DiskType } from "../../types/diskTypes";
import { MOBILE_MAX_W, WINDOW_W, calcRem, fontTheme } from "../../styles/theme";
import { lightTheme } from "../../styles/colors";

import { ReactComponent as Bookmark } from "../../assets/svg/bookmark.svg";
import { ReactComponent as PlusFilled } from "../../assets/svg/plus_filled.svg";
import { ReactComponent as CloseCircle } from "../../assets/svg/close_circle.svg";
import { ReactComponent as Pen } from "../../assets/svg/pen.svg";

const DiskListGallery = ({ isMine, data }: DiskListProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [targetDisk, setTargetDisk] = useState(0);

  const setStep = useSetRecoilState(newDiskStepState);

  const navigate = useNavigate();

  const handleDiskCard = (target: number) => {
    logClickEvent({
      action: "DISK_CARD_VIEW",
      category: "disk-list",
      label: "View Disk Card",
    });
    setOpenModal(true);
    setTargetDisk(target);
  };

  const handleNewDisk = () => {
    logClickEvent({
      action: "NEW_DISK",
      category: "disk-list",
      label: "Click New Disk Button",
    });
    setStep("newDisk1");
    navigate("/new-disk", { state: "newDisk" });
  };

  const handleEditDisk = () => {
    logClickEvent({
      action: "EDIT_DISK",
      category: "disk-list",
      label: "Click Edit Disk Button",
    });
    navigate(`/edit-disk/${targetDisk}`);
  };

  return (
    <StContainer>
      <StList>
        {data.map((val, idx) => {
          const {
            content,
            createdAt,
            diskColor,
            diskId,
            diskName,
            diskOwnerId,
            diskOwnerNickname,
            isBookmark,
            isMine,
            isPrivate,
            likeCount,
            modifiedAt,
          } = val;

          return (
            <StItem
              key={`${diskName}-${diskId}`}
              onClick={() => handleDiskCard(diskId)}
            >
              <StDiskContainer>
                <Disk diskColor={diskColor as DiskColorType} />
              </StDiskContainer>
              <span>{diskName}</span>
              {isBookmark ? <Bookmark /> : <></>}
            </StItem>
          );
        })}
        {isMine ? (
          <StNewDisk onClick={handleNewDisk}>
            <PlusFilled fill={lightTheme.colors.primary01} />
            <span>새로운 디스크 생성하기</span>
          </StNewDisk>
        ) : (
          <></>
        )}
      </StList>
      {openModal ? (
        <ModalLayout
          width={WINDOW_W < MOBILE_MAX_W ? "358px" : "412px"}
          height="auto"
          bgc="transparent"
        >
          <DiskCard
            data={data.find((val) => val.diskId === targetDisk) as DiskType}
            setOpen={() => setOpenModal(false)}
          />
          <StBtnContainer>
            <Button
              btnStatus="primary02"
              clickHandler={() => setOpenModal(false)}
            >
              <StBtnText>
                <CloseCircle />
                <span>닫기</span>
              </StBtnText>
            </Button>
            {(data.find((val) => val.diskId === targetDisk) as DiskType)
              .isMine ? (
              <Button btnStatus="primary01" clickHandler={handleEditDisk}>
                <StBtnText>
                  <Pen fill={lightTheme.colors.white} />
                  <span>편집하기</span>
                </StBtnText>
              </Button>
            ) : (
              <></>
            )}
          </StBtnContainer>
        </ModalLayout>
      ) : (
        <></>
      )}
    </StContainer>
  );
};

export default DiskListGallery;

const StContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${calcRem(74)} ${calcRem(16)} ${calcRem(36)} ${calcRem(16)};
`;

const StList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${calcRem(100)}, 1fr));
  justify-items: center;
  gap: ${calcRem(16)};
  width: 100%;

  li {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${calcRem(8)};
    width: ${calcRem(100)};
    height: ${calcRem(132)};
    padding: ${calcRem(8)} ${calcRem(4)};
    border-radius: ${calcRem(8)};

    span {
      text-align: center;
      line-height: ${fontTheme.caption.lineHeight};
      letter-spacing: ${fontTheme.caption.letterSpacing};
      font-size: ${fontTheme.caption.fontSize};
      font-weight: ${fontTheme.caption.fontWeight};
    }
  }
`;

const StItem = styled.li`
  position: relative;
  cursor: pointer;
  span {
    color: ${({ theme }) => theme.colors.text01};
  }

  svg {
    position: absolute;
    top: ${calcRem(6)};
    left: ${calcRem(8)};
    width: ${calcRem(22)};
    height: ${calcRem(22)};
  }
`;

const StDiskContainer = styled.div`
  padding: 0px ${calcRem(16)};
`;

const StNewDisk = styled.li`
  background-color: ${({ theme }) => theme.colors.primary03};
  cursor: pointer;

  span {
    color: ${({ theme }) => theme.colors.text03};
    word-break: keep-all;
  }
`;

const StBtnContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${calcRem(8)};
  margin-top: ${calcRem(16)};
`;

const StBtnText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${calcRem(8)};

  svg {
    width: ${calcRem(24)};
    height: ${calcRem(24)};
  }
`;
