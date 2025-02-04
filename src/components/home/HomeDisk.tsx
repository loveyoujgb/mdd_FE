import React, { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import ModalLayout from "../layout/ModalLayout";
import DiskCard from "../diskList/DiskCard";
import Button from "../elements/Button";

import { MOBILE_MAX_W, WINDOW_W, calcRem } from "../../styles/theme";
import { lightTheme } from "../../styles/colors";

import { DiskType } from "../../types/diskTypes";
import { logClickEvent } from "../../utils/googleAnalytics";

import { ReactComponent as CloseCircle } from "../../assets/svg/close_circle.svg";
import { ReactComponent as Pen } from "../../assets/svg/pen.svg";

interface HomeDiskProps {
  bookmarkDataList: Array<DiskType>;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  targetDisk: number;
}

const HomeDisk = ({
  bookmarkDataList,
  setOpenModal,
  targetDisk,
}: HomeDiskProps) => {
  const navigate = useNavigate();

  return (
    <ModalLayout
      width={WINDOW_W < MOBILE_MAX_W ? "358px" : "412px"}
      height="auto"
      bgc="transparent"
    >
      <DiskCard
        data={
          bookmarkDataList.find(
            (val: DiskType) => val.diskId === targetDisk
          ) as DiskType
        }
        setOpen={() => setOpenModal(false)}
      />
      <StBtnContainer>
        <Button btnStatus="primary02" clickHandler={() => setOpenModal(false)}>
          <StBtnText>
            <CloseCircle />
            <span>닫기</span>
          </StBtnText>
        </Button>
        {(
          bookmarkDataList.find(
            (val: DiskType) => val.diskId === targetDisk
          ) as DiskType
        ).isMine ? (
          <Button
            btnStatus="primary01"
            clickHandler={() => {
              navigate(`/edit-disk/${targetDisk}`);
              // 디스크 수정하기
              logClickEvent({
                action: "EDIT_DISK",
                category: "home",
                label: "Click Edit Disk Button",
              });
            }}
          >
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
  );
};

export default HomeDisk;

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
