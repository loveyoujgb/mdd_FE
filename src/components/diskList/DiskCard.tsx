import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AxiosError } from "axios";
import styled, { css, keyframes } from "styled-components";

import IconConverter from "./IconConverter";
import ImageLoader from "../elements/ImageLoader";
import { bookmarkDisk, deleteDisk, likeDisk } from "../../api/diskApi";
import {
  bookmarkToastState,
  deleteToastState,
  pageState,
} from "../../state/atom";
import { logClickEvent } from "../../utils/googleAnalytics";
import {
  DISK_BTN_LIST,
  DiskBtnType,
  DiskColorType,
  DiskType,
  DiskModeType,
} from "../../types/diskTypes";
import { diskTheme, lightTheme } from "../../styles/colors";
import { calcRem, fontTheme } from "../../styles/theme";

import { ReactComponent as Like } from "../../assets/svg/like.svg";
import { ReactComponent as Gallery } from "../../assets/svg/gallery.svg";
import { ReactComponent as Text } from "../../assets/svg/text.svg";

interface DiskCardProps {
  data: DiskType;
  setOpen?: () => void;
}

const DiskCard = ({ data, setOpen }: DiskCardProps) => {
  const {
    content,
    createdAt,
    diskColor,
    diskId,
    diskName,
    diskOwnerId,
    diskOwnerNickname,
    image,
    isBookmark,
    isMine,
    isPrivate,
    likeCount,
    modifiedAt,
  } = data;
  const [loading, setLoading] = useState(false);
  const [mainImg, setMainImg] = useState<string>("");
  const [mode, setMode] = useState<DiskModeType>("gallery");
  const [showBookmark, setShowBookmark] = useState(false);
  const [likeView, setLikeView] = useState<JSX.Element[]>([]);

  const setOpenBookmarkToast = useSetRecoilState(bookmarkToastState);
  const setOpenDeleteToast = useSetRecoilState(deleteToastState);
  const page = useRecoilValue(pageState);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const queryClient = useQueryClient();

  useEffect(() => {
    setMainImg(image[0].imgUrl);
    setShowBookmark(isBookmark);
  }, []);

  // 디스크 삭제 =======================================================
  const { mutate: handleDelete } = useMutation(deleteDisk, {
    onSuccess: () => {
      queryClient.invalidateQueries(["diskList"]);
      queryClient.invalidateQueries(["userBookmarkDisk"]);
      setOpen && setOpen();
      setOpenDeleteToast(true);
    },
  });

  // 디스크 북마크 =======================================================
  const { mutate: handleBookmark } = useMutation(bookmarkDisk, {
    onSuccess: (data) => {
      if (data) {
        setOpenBookmarkToast({
          open: true,
          text: "대표 디스크로 설정되었어요",
        });
      }
      setShowBookmark(!isBookmark);
      queryClient.invalidateQueries(["diskList"]);
      queryClient.invalidateQueries(["userBookmarkDisk"]);
      pathname.includes("home") && setOpen && setOpen();
    },
    onError: (err: AxiosError<any>) => {
      if (err.response) {
        if (err.response.data.ErrorCode === "BOOKMARK_DISK_LIMIT") {
          setOpenBookmarkToast({
            open: true,
            text: "대표 디스크 자리가 꽉 찼어요!",
          });
        }
      }
    },
  });

  // 디스크 좋아요 =======================================================
  const { mutate: handleLike } = useMutation(likeDisk, {
    onSuccess: () => {
      queryClient.invalidateQueries(["diskList"]);
      queryClient.invalidateQueries(["userBookmarkDisk"]);

      const likeViewCopy = [...likeView];
      const newKey = Date.now();
      likeViewCopy.push(
        <LikeIcon
          fillColor={
            diskColor === "NEON_ORANGE"
              ? lightTheme.colors.text01
              : lightTheme.colors.white
          }
          key={newKey}
        >
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
  });

  // 디스크 대표 이미지 설정 =======================================================
  const handleMainImg = (target: number) => setMainImg(image[target].imgUrl);

  const clickHandler = (name: DiskBtnType) => {
    const pathname = window.location.pathname.split("/")[1];
    switch (name) {
      case "like":
        handleLike(diskId);
        return;
      case "edit":
        logClickEvent({
          action: "EDIT_DISK",
          category: pathname,
          label: "Click Edit Disk Button",
        });
        navigate(`/edit-disk/${diskId}`);
        return;
      case "delete":
        if (window.confirm("디스크를 삭제하실 건가요?")) handleDelete(diskId);
        return;
      case "bookmark":
        logClickEvent({
          action: "BOOKMARK",
          category: pathname,
          label: showBookmark ? "UnBookmark" : "Bookmark",
        });
        handleBookmark(diskId);
        return;
      case "mode":
        logClickEvent({
          action: "DISK_MODE",
          category: pathname,
          label: mode === "gallery" ? "View Disk Text" : "View Disk Image",
        });
        mode === "text" ? setMode("gallery") : setMode("text");
        return;
      default:
        return;
    }
  };

  return (
    <Stcontainer diskColor={diskColor}>
      <StDiskName diskColor={diskColor}>{diskName}</StDiskName>
      <StPreviewContainer>
        <ImageLoader src={mainImg} />
      </StPreviewContainer>
      <StImgList>
        {image.map((val, idx) => {
          const { imgId, imgUrl } = val;
          return (
            <li key={`preview-${imgId}`}>
              <StPreview visibile={true} onClick={() => handleMainImg(idx)}>
                {imgUrl === mainImg ? <StDim /> : <></>}
                <ImageLoader src={imgUrl} />
              </StPreview>
            </li>
          );
        })}
      </StImgList>
      <StSubContainer>
        {isMine ? (
          <StLikesCount isMine={true} diskColor={diskColor}>
            <Like
              fill={
                diskColor === "PURPLE"
                  ? lightTheme.colors.white
                  : lightTheme.colors.text01
              }
            />
            <span>{likeCount}</span>
          </StLikesCount>
        ) : (
          <StLikesCount
            onClick={() => clickHandler("like")}
            isMine={false}
            diskColor={diskColor}
          >
            <Like
              fill={
                diskColor === "NEON_ORANGE"
                  ? lightTheme.colors.text01
                  : lightTheme.colors.white
              }
            />
            {likeView}
            <span>{likeCount}</span>
          </StLikesCount>
        )}
        {isMine ? (
          <StBtnList>
            {DISK_BTN_LIST.map((val, idx) => {
              return (
                <React.Fragment key={`${val}-${idx}`}>
                  {page === "diskListGallery" && val === "edit" ? (
                    <></>
                  ) : (
                    <li onClick={() => clickHandler(val)}>
                      <StIconContainer diskColor={diskColor} isTextMode={false}>
                        {IconConverter(
                          val as DiskBtnType,
                          showBookmark,
                          diskColor === "NEON_ORANGE"
                        )}
                        <>{val === "like" ? likeView : null}</>
                      </StIconContainer>
                    </li>
                  )}
                </React.Fragment>
              );
            })}
          </StBtnList>
        ) : (
          <StIconContainer
            diskColor={diskColor}
            isTextMode={false}
            onClick={() => clickHandler("mode")}
          >
            <Text
              fill={
                diskColor === "NEON_ORANGE"
                  ? lightTheme.colors.text01
                  : lightTheme.colors.white
              }
            />
          </StIconContainer>
        )}
      </StSubContainer>
      {mode === "text" ? (
        <StContentContainer>
          <Stcontent>
            <p>{content}</p>
            <span>첫 생성일: {createdAt}</span>
          </Stcontent>
          <StIconContainer
            diskColor={diskColor}
            onClick={() => clickHandler("mode")}
            isTextMode={true}
          >
            <Gallery
              fill={
                diskColor === "NEON_ORANGE"
                  ? lightTheme.colors.text01
                  : lightTheme.colors.white
              }
            />
          </StIconContainer>
        </StContentContainer>
      ) : (
        <></>
      )}
    </Stcontainer>
  );
};

export default DiskCard;

const Stcontainer = styled.div<{ diskColor: DiskColorType }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${calcRem(16)};
  width: 100%;
  height: auto;
  padding: ${calcRem(24)} ${calcRem(16)};
  background-color: ${({ diskColor }) => diskTheme[`${diskColor}`].bg};
  border: 1px solid;
  border-color: ${({ diskColor }) => diskTheme[`${diskColor}`].border};
  border-radius: ${calcRem(12)};
  position: relative;
`;

const StDiskName = styled.h3<{ diskColor: DiskColorType }>`
  color: ${({ diskColor }) =>
    diskColor === "PURPLE"
      ? lightTheme.colors.white
      : lightTheme.colors.text01};
  text-align: center;
  line-height: ${fontTheme.display01.lineHeight};
  letter-spacing: ${fontTheme.display01.letterSpacing};
  font-size: ${fontTheme.display01.fontSize};
  font-weight: ${fontTheme.display01.fontWeight};
  font-family: "NanumSquareNeo";
`;

const StPreviewContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1;
  background-color: ${({ theme }) => theme.colors.primary03};
  border-radius: ${calcRem(8)};
  overflow: hidden;
`;

const StMainImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StImgList = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${calcRem(8)};
  width: 100%;
  height: auto;

  li {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    aspect-ratio: 1;
    background-color: transparent;
    border-radius: ${calcRem(8)};
    overflow: hidden;
  }
`;

const StPreview = styled.div<{ visibile: boolean }>`
  opacity: ${({ visibile }) => (visibile ? 1 : 0)};
  display: flex;
  width: 100%;
  aspect-ratio: 1;
  position: relative;
  cursor: ${({ visibile }) => (visibile ? "pointer" : "default")};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StDim = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.transparent03};
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
`;

const StSubContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const StLikesCount = styled.div<{ isMine: boolean; diskColor: DiskColorType }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ isMine }) => (isMine ? calcRem(4) : calcRem(8))};
  cursor: pointer;
  position: relative;

  ${({ isMine, diskColor }) =>
    !isMine &&
    css`
      padding: ${calcRem(8)} ${calcRem(16)};
      background-color: ${diskTheme[diskColor].border}};
      border-radius: ${calcRem(12)};
    `}

  svg {
    width: ${({ isMine }) => (isMine ? calcRem(16) : calcRem(24))};
    height: ${({ isMine }) => (isMine ? calcRem(16) : calcRem(24))};
  }

  span {
    color: ${({ isMine, diskColor }) =>
      isMine
        ? diskColor === "PURPLE"
          ? lightTheme.colors.white
          : lightTheme.colors.text01
        : diskColor === "NEON_ORANGE"
        ? lightTheme.colors.text01
        : lightTheme.colors.white};
    ${({ isMine }) =>
      isMine
        ? css`
            line-height: ${fontTheme.body01.lineHeight};
            letter-spacing: ${fontTheme.body01.letterSpacing};
            font-size: ${fontTheme.body01.fontSize};
            font-weight: ${fontTheme.body01.fontWeight};
          `
        : css`
            line-height: ${fontTheme.button.lineHeight};
            letter-spacing: ${fontTheme.button.letterSpacing};
            font-size: ${fontTheme.button.fontSize};
            font-weight: ${fontTheme.button.fontWeight};
          `}
  }
`;

const StBtnList = styled.ul`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${calcRem(12)};
`;

const StContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: ${calcRem(24)} ${calcRem(16)};
  background-color: ${({ theme }) => theme.colors.transparent01};
  border-radius: ${calcRem(12)};
  position: absolute;
  top: 0;
  left: 0;
`;

const Stcontent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${calcRem(8)};
  width: 100%;

  p,
  span {
    line-height: ${fontTheme.display01.lineHeight};
    letter-spacing: ${fontTheme.display01.letterSpacing};
    font-size: ${fontTheme.display01.fontSize};
    font-weight: ${fontTheme.display01.fontWeight};
    font-family: "NanumSquareNeo";
  }

  p {
    width: 100%;
    height: 80%;
    color: ${({ theme }) => theme.colors.white};
    text-align: center;
    white-space: pre-wrap;
    word-break: break-all;
    overflow: scroll;
  }

  span {
    color: ${({ theme }) => theme.colors.text02};
  }
`;

const StIconContainer = styled.div<{
  diskColor: DiskColorType;
  isTextMode: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${calcRem(40)};
  height: ${calcRem(40)};
  background-color: ${({ diskColor }) => diskTheme[diskColor].border};
  border-radius: ${calcRem(12)};
  cursor: pointer;

  ${({ isTextMode }) =>
    isTextMode &&
    css`
      position: absolute;
      right: ${calcRem(16)};
      bottom: ${calcRem(24)};
    `}

  svg {
    width: ${calcRem(24)};
    height: ${calcRem(24)};
  }
`;

const floatAnimation = (fillColor: string) => keyframes`
  0% {
    opacity: 1;
    fill: ${fillColor};
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

const LikeIcon = styled.div<{ fillColor: string }>`
  position: absolute;

  svg {
    cursor: pointer;
    animation: ${({ fillColor }) => floatAnimation(fillColor)} 1s ease-in-out;
  }
`;
