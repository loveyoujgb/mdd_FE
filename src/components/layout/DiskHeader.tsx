import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { lightTheme } from "../../styles/colors";
import { MOBILE_MAX_W, calcRem, fontTheme } from "../../styles/theme";

import { ReactComponent as Arrow } from "../../assets/svg/arrow.svg";
import { ReactComponent as PlusFilled } from "../../assets/svg/plus_filled.svg";
import { ReactComponent as ListCategoqy } from "../../assets/svg/list_category.svg";
import { ReactComponent as ListVertical } from "../../assets/svg/list_vertical.svg";
import { useRecoilState } from "recoil";
import { pageState } from "../../state/atom";

interface DiskHeaderProps {
  isMyDisk: boolean;
  titleText: string;
  jc?: string;
}

const DiskHeader = ({
  isMyDisk,
  titleText,
  jc = "space-between",
}: DiskHeaderProps) => {
  const [page, setPage] = useRecoilState(pageState);

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
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
          <button
            onClick={() =>
              setPage((prev) =>
                prev === "diskListFeed" ? "diskListGallery" : "diskListFeed"
              )
            }
          >
            {page === "diskListGallery" ? (
              <ListVertical fill={lightTheme.colors.primary01} />
            ) : (
              <ListCategoqy fill={lightTheme.colors.primary01} />
            )}
          </button>
          {isMyDisk ? (
            <button onClick={() => navigate("/new-disk")}>
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
  width: 100%;
  height: 50px;
  padding: 0 32px;
  background-color: ${({ theme }) => theme.colors.bg};
  position: relative;

  @media screen and (max-width: ${MOBILE_MAX_W}px) {
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
