import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";

import LoadingSpinner from "../LoadingSpinner";
import DiskCarousel from "../newDisk/DiskCarousel";
import NewDiskCard from "../newDisk/NewDiskCard";
import Input from "../elements/Input";
import Textarea from "../elements/Textarea";
import Button from "../elements/Button";
import { patchDisk } from "../../api/diskApi";
import {
  DISK_CONTENT_MAX_LENGTH,
  DISK_NAME_MAX_LENGTH,
} from "../../utils/validations";
import {
  RANDOM_DISK_NAME_LIST,
  getRandomName,
} from "../../utils/getRandomName";
import { getLoc } from "../../utils/localStorage";
import { logClickEvent } from "../../utils/googleAnalytics";
import {
  DISK_COLOR_LIST,
  DiskImgType,
  DiskMainImgType,
  DiskPreviewType,
  DiskType,
} from "../../types/diskTypes";
import { InputStatusType } from "../../types/etcTypes";
import { MOBILE_MAX_W, calcRem, fontTheme } from "../../styles/theme";

import { ReactComponent as Dice } from "../../assets/svg/dice.svg";

interface EditDiskProps {
  data: DiskType;
}

export type PatchType = {
  data: any;
  diskId: number;
};

const EditDisk = ({ data }: EditDiskProps) => {
  const [valid, setValid] = useState<boolean>(false);
  const [updated, setUpdated] = useState<boolean>(false);
  const [diskNum, setDiskNum] = useState<number>(0);
  const [diskName, setDiskName] = useState<string>(RANDOM_DISK_NAME_LIST[0]);
  const [diskNameStatus, setDiskNameStatus] =
    useState<InputStatusType>("default");
  const [files, setFiles] = useState<File[]>([]);
  const [defaultImgList, setDefaultImgList] = useState<DiskImgType[]>([]);
  const [deleteImgList, setDeleteImgList] = useState<number[]>([]);
  const [previewList, setPreviewList] = useState<DiskPreviewType[]>([]);
  const [mainImg, setMainImg] = useState<DiskMainImgType>({
    imgUrl: "",
    index: 0,
  });
  const [content, setContent] = useState("");
  const [contentStatus, setContentStatus] =
    useState<InputStatusType>("default");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    setDiskName(data.diskName);
    setDiskNum(DISK_COLOR_LIST.indexOf(data.diskColor));
    setContent(data.content);
    setMainImg({ imgUrl: data.image[0].imgUrl, index: 0 });
    setDefaultImgList(data.image);
    setPreviewList(data.image.map((val, i) => ({ ...val, index: i })));
  }, []);

  useEffect(() => {
    // DISKNAME 유효성 검사
    const diskNameValid = diskName.length ? true : false;

    // IMAGE 유효성 검사
    const imgIdArr = data.image.map((val) => val.imgId).sort();
    const deleteAll =
      JSON.stringify(imgIdArr) === JSON.stringify(deleteImgList.sort());
    // 삭제한 이미지가 있을 경우 > 추가된 이미지가 있을 경우 : 추가된 이미지가 없을 경우
    // 삭제한 이미지가 없을 경우 > true
    const imgValid = deleteImgList.length
      ? files.length
        ? true
        : !deleteAll
      : true;

    setValid(diskNameValid && imgValid);
  }, [diskName, deleteImgList, files]);

  useEffect(() => {
    const imageUpdated =
      JSON.stringify(defaultImgList) !== JSON.stringify(previewList);

    data.content === content &&
    data.diskColor === DISK_COLOR_LIST[diskNum] &&
    data.diskName === diskName &&
    !imageUpdated
      ? setUpdated(false)
      : setUpdated(true);
  }, [diskName, content, diskNum, previewList]);

  const { mutate: editDisk, isLoading: editLoading } = useMutation(patchDisk, {
    onSuccess: () => {
      logClickEvent({
        action: "SUBMIT_EDIT_DISK",
        category: "edit-disk",
        label: "Submit Edit Disk",
      });
      queryClient.invalidateQueries(["diskList"]);
      queryClient.invalidateQueries(["diskById"]);
      navigate(`/disk-list/${getLoc("memberId")}`);
    },
    onError: (err: any) => {
      err.response.data.ErrorCode === "NOT_SUPPORTED_FILE_TYPE"
        ? alert(
            "디스크 이미지는 현재 PNG, JPG, JPEG 확장자만 지원하고 있습니다."
          )
        : alert("디스크 편집에 실패했습니다.");
    },
  });

  const handleSubmit = async () => {
    const frm = new FormData();
    const newData = {
      diskName,
      content,
      diskColor: DISK_COLOR_LIST[diskNum],
      isPrivate: false,
      deleteImgList,
    };
    files.map((file) => frm.append("file", file));
    frm.append(
      "data",
      new Blob([JSON.stringify(newData)], {
        type: "application/json",
      })
    );
    editDisk({ diskId: data.diskId, frm: frm });
  };

  return (
    <>
      {editLoading ? (
        <LoadingSpinner text="디스크 굽는 중" />
      ) : (
        <StContainer>
          <StDiskCover>
            <StDiskCarousel>
              <DiskCarousel disk={data} setDiskNum={setDiskNum} />
            </StDiskCarousel>
            <StInputContainer>
              <Input
                labelText="디스크 이름"
                bottomText="직접 수정할 수 있어요"
                value={diskName}
                setValue={setDiskName}
                status={diskNameStatus}
                setStatus={setDiskNameStatus}
                placeholder=""
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
          </StDiskCover>
          <StDiskContent>
            <NewDiskCard
              isNew={false}
              disk={data}
              diskName={diskName}
              diskColor={DISK_COLOR_LIST[diskNum]}
              previewList={previewList}
              mainImg={mainImg}
              files={files}
              setFiles={setFiles}
              setPreviewList={setPreviewList}
              setMainImg={setMainImg}
              setDeleteImgList={setDeleteImgList}
              defaultImgList={defaultImgList}
            />
            <StContent>
              <Textarea
                labelText="디스크 메모"
                value={content}
                setValue={setContent}
                status={contentStatus}
                setStatus={setContentStatus}
                maxLength={DISK_CONTENT_MAX_LENGTH}
                placeholder="어떤 디깅 메모리를 담은 디스크인가요?"
                jc="flex-start"
                TopChildren={<StOptionText>선택사항</StOptionText>}
                isMultiLine={true}
              />
            </StContent>
          </StDiskContent>
          <StBtnContainer>
            <Button
              btnStatus={
                !editLoading && valid && updated ? "primary01" : "disabled"
              }
              clickHandler={handleSubmit}
              disabled={!editLoading && valid && updated ? false : true}
            >
              <span>디스크 굽기</span>
            </Button>
          </StBtnContainer>
        </StContainer>
      )}
    </>
  );
};

export default EditDisk;

const StContainer = styled.div`
  padding-top: ${calcRem(50)};
`;

const StDiskCover = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${calcRem(24)};
  padding: ${calcRem(24)} ${calcRem(32)};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary03};

  @media screen and (max-width: ${MOBILE_MAX_W}px) {
    padding: ${calcRem(24)} ${calcRem(16)};
  }
`;

const StDiskCarousel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StInputContainer = styled.div`
  width: 100%;
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

const StDiskContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${calcRem(24)};
  width: 100%;
  padding: ${calcRem(24)} ${calcRem(32)};
  background-color: ${({ theme }) => theme.colors.bg};

  @media screen and (max-width: ${MOBILE_MAX_W}px) {
    padding: ${calcRem(24)} ${calcRem(16)};
  }
`;

const StContent = styled.div`
  width: 100%;
`;

const StOptionText = styled.span`
  color: ${({ theme }) => theme.colors.text02};
  line-height: ${fontTheme.body02.lineHeight};
  letter-spacing: ${fontTheme.body02.letterSpacing};
  font-size: ${fontTheme.body02.fontSize};
  font-weight: ${fontTheme.body02.fontWeight};
`;

const StBtnContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: ${calcRem(32)};
  width: 100%;
  padding: ${calcRem(12)} ${calcRem(32)} ${calcRem(36)};

  @media screen and (max-width: ${MOBILE_MAX_W}px) {
    padding: ${calcRem(12)} ${calcRem(16)} ${calcRem(36)};
  }
`;
