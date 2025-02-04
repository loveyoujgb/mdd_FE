import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import styled from "styled-components";

import {
  lightThemeState,
  newDiskState,
  newDiskStepState,
  pageState,
} from "../../state/atom";
import { getLoc } from "../../utils/localStorage";
import { logClickEvent } from "../../utils/googleAnalytics";
import { MOBILE_MAX_W, calcRem, fontTheme } from "../../styles/theme";
import { darkTheme, lightTheme } from "../../styles/colors";

import { ReactComponent as Arrow } from "../../assets/svg/arrow.svg";
import { ReactComponent as PlusFilled } from "../../assets/svg/plus_filled.svg";
import { ReactComponent as ListCategory } from "../../assets/svg/list_category.svg";
import { ReactComponent as ListVertical } from "../../assets/svg/list_vertical.svg";

interface DiskHeaderProps {
  param?: string;
  isMyDisk: boolean;
  titleText: string;
  jc?: string;
  newDiskContent?: boolean;
}

const DiskHeader = ({
  param,
  isMyDisk,
  titleText,
  jc = "space-between",
  newDiskContent = false,
}: DiskHeaderProps) => {
  const [page, setPage] = useRecoilState(pageState);
  const [step, setStep] = useRecoilState(newDiskStepState);
  const resetNewDisk = useResetRecoilState(newDiskState);

  const isLightTheme = useRecoilValue(lightThemeState);

  const navigate = useNavigate();

  // status bar theme-color 변경
  useEffect(() => {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute(
        "content",
        getLoc("theme") === "lightMode"
          ? `${lightTheme.colors.bg}`
          : `${darkTheme.colors.bg}`
      ); // 원하는 색상으로 변경
      // return () =>
      //   themeColorMeta.setAttribute(
      //     "content",
      //     getLoc("theme") === "lightMode"
      //       ? `${lightTheme.colors.bg}`
      //       : `${darkTheme.colors.bg}`
      //   );
    }
  }, [isLightTheme]);

  const handleGoBack = () => {
    if (newDiskContent)
      setStep((prev) => (prev === "newDisk2" ? "newDisk1" : "newDiskSignUp1"));
    switch (page) {
      case "diskListFeed":
        navigate(`/home/${param}`);
        return;
      case "diskListGallery":
        navigate(`/home/${param}`);
        return;
      case "editDisk":
        navigate(-1);
        return;
      case "newDisk":
        if (step === "newDisk2") {
          setStep("newDisk1");
        } else if (step === "newDiskSignUp2") {
          setStep("newDiskSignUp1");
        } else {
          resetNewDisk();
          navigate(-1);
        }
        return;
      case "settings":
        navigate(`/home/${getLoc("memberId")}`);
        return;
      default:
        return;
    }
  };

  const handleListMode = () => {
    logClickEvent({
      action: "DISK_LIST_MODE",
      category: "disk-list",
      label: page === "diskListFeed" ? "View Gallery List" : "View Feed List",
    });
    setPage((prev) =>
      prev === "diskListFeed" ? "diskListGallery" : "diskListFeed"
    );
  };

  const handleNewDisk = () => {
    logClickEvent({
      action: "NEW_DISK",
      category: "disk-list",
      label: "Click New Disk Button",
    });
    navigate("/new-disk", { state: "newDisk" });
  };

  return (
    <StHeader jc={jc}>
      <StTitle>
        <button onClick={handleGoBack}>
          <Arrow fill={lightTheme.colors.primary01} />
        </button>
        <h1>{titleText}</h1>
      </StTitle>
      {page === "diskListFeed" || page === "diskListGallery" ? (
        <StBtnContainer>
          <button name="changeListMode" onClick={handleListMode}>
            {page === "diskListGallery" ? (
              <ListVertical fill={lightTheme.colors.primary01} />
            ) : (
              <ListCategory fill={lightTheme.colors.primary01} />
            )}
          </button>
          {isMyDisk ? (
            <button name="goSettings" onClick={handleNewDisk}>
              <PlusFilled fill={lightTheme.colors.primary01} />
            </button>
          ) : (
            <></>
          )}
        </StBtnContainer>
      ) : (
        <></>
      )}
    </StHeader>
  );
};

export default DiskHeader;

const StHeader = styled.div<{ jc: string }>`
  display: flex;
  align-items: center;
  justify-content: ${({ jc }) => jc};
  width: ${MOBILE_MAX_W}px;
  height: 50px;
  padding: 0 32px;
  background-color: ${({ theme }) => theme.colors.bg};
  position: fixed;
  z-index: 55;

  @media screen and (max-width: ${MOBILE_MAX_W}px) {
    width: 100%;
    padding: 0 16px;
  }

  svg {
    width: ${calcRem(24)};
    height: ${calcRem(24)};
  }
`;

const StTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${calcRem(8)};

  h1 {
    color: ${({ theme }) => theme.colors.text01};
    font-family: "NanumSquareNeo";
    line-height: ${fontTheme.display01.lineHeight};
    letter-spacing: ${fontTheme.display01.letterSpacing};
    font-size: ${fontTheme.display01.fontSize};
    font-weight: ${fontTheme.display01.fontWeight};
  }

  svg {
    transform: rotate(-90deg);
  }
`;

const StBtnContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${calcRem(12)};
`;
