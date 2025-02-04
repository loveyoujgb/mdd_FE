import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";

import { calcRem, MOBILE_MAX_W } from "../styles/theme";

import { lightThemeState } from "../state/atom";
import { getUserInfo, postVisitCount } from "../api/memberApi";
import { getBookmarkDiskList } from "../api/diskApi";
import { logClickEvent } from "../utils/googleAnalytics";
import { getCookie, setCookie } from "../utils/cookie";
import { getLoc } from "../utils/localStorage";

import AppLayout from "../components/layout/AppLayout";
import Header from "../components/layout/Header";
import Guide from "../components/Guide";
import ProfileModal from "../components/home/ProfileModal";
import NotFound from "./NotFound";
import LoadingSpinner from "../components/LoadingSpinner";
import HomeUserInfo from "../components/home/HomeUserInfo";
import HomeUserDIskList from "../components/home/HomeUserDIskList";
import HomeBottom from "../components/home/HomeBottom";
import HomeDisk from "../components/home/HomeDisk";

import DotBackground from "../assets/img/dot_background.png";
import DotBackgroundDark from "../assets/img/dot_background_dark.png";

export type StDotBackgroundProps = {
  image: string;
};

const HomePage = () => {
  const queryClient = useQueryClient();

  const [openDiskModal, setOpenDiskModal] = useState<boolean>(false);
  const [targetDisk, setTargetDisk] = useState<number>(0);
  const [like, setLike] = useState<number>(0);
  const [openGuidemodal, setOpenGuidemodal] = useState<boolean>(false);
  const [openProfileModal, setOpenProfileModal] = useState<boolean>(false);

  const isLightTheme = useRecoilValue(lightThemeState);

  const { id } = useParams<{ id: string }>();

  const expiresIn = new Date(Date.now() + 60 * 60 * 1000);

  const { data, isLoading, isSuccess, isError } = useQuery(
    ["userInfo", id],
    () => getUserInfo(id as string),
    {
      onSuccess: (res) => {
        setLike(res.likeCount);
        if (getCookie("visit") !== id && getLoc("memberId") !== id) {
          setCookie("visit", id as string, expiresIn);
          mutationPostVisitCount();
        }
      },
      refetchOnWindowFocus: false,
    }
  );

  const { mutate: mutationPostVisitCount } = useMutation(
    () => postVisitCount(id as string),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(["userInfo"]);
      },
    }
  );

  const {
    data: bookmarkData,
    isLoading: bookmarkIsLoading,
    isSuccess: bookmarkIsSuccess,
    isError: bookmarkIsError,
  } = useQuery(["userBookmarkDisk", id], () =>
    getBookmarkDiskList(id as string)
  );

  return (
    <>
      {(isLoading || bookmarkIsLoading) && (
        <LoadingSpinner text="디스크 불러오는 중" />
      )}

      {!isLoading && !bookmarkIsLoading && isSuccess && bookmarkIsSuccess ? (
        <AppLayout>
          <Header
            isMyDisk={data.isMe}
            jc={data.isMe ? "flex-end" : "flex-start"}
            userName={data.nickname}
          ></Header>
          <StContainer>
            <StDotBackground
              image={isLightTheme ? DotBackground : DotBackgroundDark}
            >
              <StSubContainer>
                <HomeUserInfo
                  data={data}
                  setOpenProfileModal={setOpenProfileModal}
                  like={like}
                />

                <HomeUserDIskList
                  bookmarkData={bookmarkData}
                  setOpenDiskModal={setOpenDiskModal}
                  setTargetDisk={setTargetDisk}
                />

                <HomeBottom
                  data={data}
                  setOpenGuidemodal={setOpenGuidemodal}
                  like={like}
                  setLike={setLike}
                />
              </StSubContainer>
            </StDotBackground>
          </StContainer>

          {openProfileModal ? (
            <ProfileModal
              data={data}
              setOpen={() => {
                setOpenProfileModal(false);
                // 프로필 편집하기 클릭
                logClickEvent({
                  action: "EDIT_PROFILE",
                  category: "home",
                  label: "Click Edit Profile",
                });
              }}
            />
          ) : (
            <></>
          )}
          <Guide modalOpen={openGuidemodal} setModalOpen={setOpenGuidemodal} />
        </AppLayout>
      ) : isError || bookmarkIsError ? (
        <NotFound />
      ) : (
        <></>
      )}

      {openDiskModal && (
        <HomeDisk
          bookmarkDataList={bookmarkData.diskList}
          setOpenModal={setOpenDiskModal}
          targetDisk={targetDisk}
        />
      )}
    </>
  );
};

export default HomePage;

const StContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.bg};
  width: 100%;
  height: calc(100vh - 62px);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const StDotBackground = styled.div<StDotBackgroundProps>`
  position: absolute;
  top: 0;
  background-image: url(${({ image }) => image});
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 55%;
`;

const StSubContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: ${calcRem(24)} ${calcRem(32)} ${calcRem(36)} ${calcRem(32)};
  @media screen and (max-width: ${MOBILE_MAX_W}px) {
    padding: ${calcRem(24)} ${calcRem(16)} ${calcRem(36)} ${calcRem(16)};
  }
`;
