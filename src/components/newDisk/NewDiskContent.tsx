import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";

import LoadingSpinner from "../LoadingSpinner";
import { NewDiskProps } from "../../pages/NewDiskPage";
import NewDiskCard from "./NewDiskCard";
import Textarea from "../elements/Textarea";
import Button from "../elements/Button";
import { postDisk } from "../../api/diskApi";
import {
  createToastState,
  newDiskState,
  newDiskStepState,
} from "../../state/atom";
import { getLoc } from "../../utils/localStorage";
import { DISK_CONTENT_MAX_LENGTH } from "../../utils/validations";
import { logClickEvent } from "../../utils/googleAnalytics";
import { DiskMainImgType, DiskPreviewType } from "../../types/diskTypes";
import { InputStatusType } from "../../types/etcTypes";
import { MOBILE_MAX_W, calcRem, fontTheme } from "../../styles/theme";

const NewDiskContent = ({ titleText }: NewDiskProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewList, setPreviewList] = useState<DiskPreviewType[]>([]);
  const [mainImg, setMainImg] = useState<DiskMainImgType>({
    imgUrl: "",
    index: 0,
  });
  const [content, setContent] = useState("");
  const [contentStatus, setContentStatus] =
    useState<InputStatusType>("default");

  const [newDisk, setNewDisk] = useRecoilState(newDiskState);
  const resetNewDisk = useResetRecoilState(newDiskState);
  const [step, setStep] = useRecoilState(newDiskStepState);
  const setOpenCreateToast = useSetRecoilState(createToastState);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  useEffect(() => {
    previewList.length
      ? setMainImg({ imgUrl: previewList[0].imgUrl, index: 0 })
      : setMainImg({ imgUrl: "", index: 0 });
  }, [previewList]);

  const { mutate: addDisk, isLoading: postLoading } = useMutation(postDisk, {
    onSuccess: () => {
      logClickEvent({
        action: "SUBMIT_NEW_DISK",
        category: "new-disk",
        label: "Submit New Disk",
      });
      resetNewDisk();
      setStep("newDisk1");
      setOpenCreateToast(true);
      queryClient.invalidateQueries(["diskList"]);
      step === "newDiskSignUp2"
        ? window.location.replace(`/home/${getLoc("memberId")}`)
        : navigate(`/disk-list/${getLoc("memberId")}`);
    },
    onError: (err: any) => {
      err.response.data.ErrorCode === "NOT_SUPPORTED_FILE_TYPE"
        ? alert(
            "디스크 이미지는 현재 PNG, JPG, JPEG 확장자만 지원하고 있습니다."
          )
        : alert("디스크 생성에 실패했습니다.");
    },
  });

  const handleSubmit = async () => {
    const frm = new FormData();
    const newData = { ...newDisk, content };
    files.map((file) => frm.append("file", file));
    frm.append(
      "data",
      new Blob([JSON.stringify(newData)], {
        type: "application/json",
      })
    );

    addDisk(frm);
  };

  const handleSkip = () => {
    logClickEvent({
      action: "SKIP_NEW_DISK",
      category: "new-disk",
      label: "Skip New Disk",
    });
    window.location.replace(`/home/${getLoc("memberId")}`);
  };

  return (
    <>
      {postLoading ? (
        <LoadingSpinner text="디스크 굽는 중" />
      ) : (
        <StContainer>
          <h2>{titleText}</h2>
          <NewDiskCard
            isNew={true}
            disk={newDisk}
            diskName={newDisk.diskName}
            previewList={previewList}
            mainImg={mainImg}
            files={files}
            setFiles={setFiles}
            setPreviewList={setPreviewList}
            setMainImg={setMainImg}
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
          <StBtnContainer>
            <Button
              btnStatus={
                !postLoading && files.length ? "primary01" : "disabled"
              }
              clickHandler={() => handleSubmit()}
              disabled={!postLoading && files.length ? false : true}
            >
              <span>디스크 굽기</span>
            </Button>
            <StSkipBtn>
              {step === "newDiskSignUp2" ? (
                <Button btnStatus="transparent" clickHandler={handleSkip}>
                  <span>나중에 만들기</span>
                </Button>
              ) : (
                <></>
              )}
            </StSkipBtn>
          </StBtnContainer>
        </StContainer>
      )}
    </>
  );
};

export default NewDiskContent;

const StContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: ${calcRem(50)} 0 0;
  background-color: ${({ theme }) => theme.colors.bg};

  @media screen and (max-width: ${MOBILE_MAX_W}px) {
    padding: ${calcRem(50)} ${calcRem(16)} 0;
  }

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

const StContent = styled.div`
  width: 100%;
  padding: ${calcRem(24)} ${calcRem(32)} ${calcRem(60)};

  @media screen and (max-width: ${MOBILE_MAX_W}px) {
    padding: ${calcRem(24)} ${calcRem(0)} ${calcRem(24)};
  }
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
  padding: ${calcRem(0)} ${calcRem(32)};

  @media screen and (max-width: ${MOBILE_MAX_W}px) {
    padding: 0;
  }
`;

const StSkipBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
