import React, { ChangeEvent } from "react";
import styled from "styled-components";
import Resizer from "react-image-file-resizer";

import PreviewList from "./PreviewList";
import { DISK_IMG_MAX_LENGTH, IMG_MAX_SIZE } from "../../utils/validations";
import {
  DiskColorType,
  DiskImgType,
  DiskMainImgType,
  DiskPreviewType,
  DiskType,
  NewDiskType,
} from "../../types/diskTypes";
import { MOBILE_MAX_W, calcRem, fontTheme } from "../../styles/theme";
import { diskTheme, lightTheme } from "../../styles/colors";

import { ReactComponent as EmptyRegisterDisk } from "../../assets/svg/empty_register_disk.svg";

interface NewDiskCardProps {
  isNew: boolean;
  disk: NewDiskType | DiskType;
  diskName: string;
  diskColor?: DiskColorType;
  files: File[];
  setFiles: (value: React.SetStateAction<File[]>) => void;
  previewList: DiskPreviewType[];
  setPreviewList: (value: React.SetStateAction<DiskPreviewType[]>) => void;
  mainImg: DiskMainImgType;
  setMainImg: (value: React.SetStateAction<DiskMainImgType>) => void;
  setDeleteImgList?: React.Dispatch<React.SetStateAction<number[]>>;
  defaultImgList?: DiskImgType[];
}

const NewDiskCard = ({
  isNew,
  disk,
  diskName,
  diskColor,
  files,
  setFiles,
  previewList,
  setPreviewList,
  mainImg,
  setMainImg,
  setDeleteImgList,
  defaultImgList = [],
}: NewDiskCardProps) => {
  const resizeFile = (file: File) =>
    new Promise((res) => {
      Resizer.imageFileResizer(
        file,
        1500,
        1500,
        "JPEG",
        80,
        0,
        (uri) => res(uri),
        "file"
      );
    });

  const resizePreview = (file: File) =>
    new Promise((res) => {
      Resizer.imageFileResizer(
        file,
        1500,
        1500,
        "JPEG",
        60,
        0,
        (uri) => res(uri),
        "base64"
      );
    });

  const handleAddImg = async (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target.files;

    if (target && target.length) {
      if (target.length + previewList.length > DISK_IMG_MAX_LENGTH) {
        // 이미지 최대 개수 제한
        window.alert(
          `사진은 최대 ${DISK_IMG_MAX_LENGTH}개까지 등록할 수 있습니다.`
        );
      } else {
        const newFiles: File[] = Array.from(target);
        newFiles.map(async (file) => {
          if (file.size > IMG_MAX_SIZE) {
            // 이미지 최대 용량 제한
            window.alert(
              `${Math.round(
                IMG_MAX_SIZE / 1000000
              )}MB 이하의 사진만 등록할 수 있습니다.`
            );
          } else {
            try {
              const compressedFile = (await resizeFile(file)) as File;
              const compressedPreview = (await resizePreview(file)) as string;
              setFiles((prev) => [...prev, compressedFile]);
              setPreviewList((prev: DiskPreviewType[]) => [
                ...prev,
                { imgId: "new", imgUrl: compressedPreview, index: prev.length },
              ]);
            } catch (err) {
              window.alert("사진을 불러올 수 없습니다.");
              throw err;
            }
          }
        });
      }
    }
  };

  const handleDeleteImg = (
    e: React.MouseEvent,
    target: number,
    targetUrl: string
  ) => {
    e.stopPropagation();
    // 이미지 데이터 업데이트
    if (isNew) {
      // 디스크 생성 페이지
      setFiles(files.filter((_, idx) => idx !== target));
    } else {
      // 디스크 편집 페이지
      if (defaultImgList.map((val) => val.imgUrl).includes(targetUrl)) {
        // 기존 사진 삭제
        const targetId = (
          defaultImgList.find((val) => val.imgUrl === targetUrl) as DiskImgType
        ).imgId;
        setDeleteImgList &&
          setDeleteImgList((prev) => [...prev, targetId as number]);
      } else {
        // 추가된 사진 삭제
        const targetIndex = previewList
          .filter((val) => val.imgId === "new")
          .map((val) => val.imgUrl)
          .indexOf(targetUrl);
        setFiles(files.filter((_, idx) => idx !== targetIndex));
      }
    }

    // 이미지 미리보기 업데이트
    setPreviewList((prev) =>
      prev
        .filter((val) => val.index !== target)
        .map((el, i) => ({ ...el, index: i }))
    );

    // 대표 이미지 변경

    mainImg.index === 0
      ? setMainImg({
          imgUrl: previewList.length > 1 ? previewList[1].imgUrl : "",
          index: 0,
        })
      : setMainImg({
          imgUrl: previewList[0].imgUrl,
          index: 0,
        });
  };

  const handleMainImg = (target: number) =>
    setMainImg({ imgUrl: previewList[target].imgUrl, index: target });

  return (
    <StGallery diskColor={diskColor ? diskColor : disk.diskColor}>
      <StDiskName diskColor={diskColor ? diskColor : disk.diskColor}>
        {diskName}
      </StDiskName>
      <StPreviewContainer>
        {previewList.length ? (
          <StMainImg src={mainImg.imgUrl} alt="main-preview" />
        ) : (
          <StEmptyContainer>
            <EmptyRegisterDisk />
            <span>1장 이상의 이미지를 등록해주세요</span>
          </StEmptyContainer>
        )}
      </StPreviewContainer>
      <StImgList>
        {PreviewList(
          previewList,
          handleAddImg,
          handleDeleteImg,
          mainImg,
          handleMainImg
        )}
      </StImgList>
    </StGallery>
  );
};

export default NewDiskCard;

const StGallery = styled.div<{ diskColor: DiskColorType }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${calcRem(16)};
  width: 412px;
  height: auto;
  padding: ${calcRem(24)} ${calcRem(16)};
  background-color: ${({ diskColor }) => diskTheme[diskColor].bg};
  border: 1px solid;
  border-color: ${({ diskColor }) => diskTheme[diskColor].border};
  border-radius: ${calcRem(12)};

  @media screen and (max-width: ${MOBILE_MAX_W}px) {
    width: 100%;
  }
`;

const StDiskName = styled.h3<{ diskColor: DiskColorType }>`
  width: 100%;
  overflow-x: hidden;
  height: ${fontTheme.display01.lineHeight};
  color: ${({ diskColor }) =>
    diskColor === "PURPLE"
      ? lightTheme.colors.white
      : lightTheme.colors.text01};
  text-align: center;
  line-height: ${fontTheme.display01.lineHeight};
  letter-spacing: ${fontTheme.display01.letterSpacing};
  font-size: ${fontTheme.display01.fontSize};
  font-weight: ${fontTheme.display01.fontWeight};
`;

const StPreviewContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1;
  background-color: ${lightTheme.colors.primary03};
  border-radius: ${calcRem(8)};
  overflow: hidden;
`;

const StMainImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StEmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${calcRem(16)};
  cursor: default;

  span {
    color: ${({ theme }) => theme.colors.primary02};
    line-height: ${fontTheme.display01.lineHeight};
    letter-spacing: ${fontTheme.display01.letterSpacing};
    font-size: ${fontTheme.display01.fontSize};
    font-weight: ${fontTheme.display01.fontWeight};
  }
`;

const StImgList = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${calcRem(8)};
  width: 100%;
  height: auto;

  li {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    aspect-ratio: 1;
    background-color: ${lightTheme.colors.primary03};
    border-radius: ${calcRem(8)};
    overflow: hidden;
  }
`;
