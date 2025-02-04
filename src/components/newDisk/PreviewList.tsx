import { ChangeEvent } from "react";
import styled from "styled-components";

import { DISK_IMG_MAX_LENGTH } from "../../utils/validations";
import { DiskMainImgType, DiskPreviewType } from "../../types/diskTypes";
import { calcRem } from "../../styles/theme";

import { ReactComponent as GalleryAdd } from "../../assets/svg/gallery_add.svg";
import { ReactComponent as CloseCircle } from "../../assets/svg/close_circle.svg";

const PreviewList = (
  list: DiskPreviewType[],
  handleAddImg: (e: ChangeEvent<HTMLInputElement>) => Promise<void>,
  handleDeleteImg: (
    e: React.MouseEvent,
    target: number,
    targetUrl: string
  ) => void,
  mainImg: DiskMainImgType,
  handleMainImg: (target: number) => void
) => {
  const arr = [];
  for (let i = 0; i < DISK_IMG_MAX_LENGTH; i++) {
    arr.push(
      <li key={`${i}-${list[i]}`}>
        {list[i] ? (
          <StPreview onClick={() => handleMainImg(i)}>
            {list[i].imgUrl === mainImg.imgUrl &&
            list[i].index === mainImg.index ? (
              <StDim>
                <button onClick={(e) => handleDeleteImg(e, i, list[i].imgUrl)}>
                  <CloseCircle />
                </button>
              </StDim>
            ) : (
              <></>
            )}
            <img src={list[i].imgUrl} alt={`preview-${i}`} />
          </StPreview>
        ) : (
          <StAddImage htmlFor="disk-img">
            <GalleryAdd />
            <input
              type="file"
              id="disk-img"
              accept=".png, .jpg, .jpeg"
              onChange={handleAddImg}
              multiple
            />
          </StAddImage>
        )}
      </li>
    );
  }
  return arr;
};

export default PreviewList;

const StPreview = styled.div`
  display: flex;
  width: 100%;
  aspect-ratio: 1;
  position: relative;
  cursor: pointer;

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

  button {
    display: flex;
    align-items: center;
    width: ${calcRem(24)};
    position: absolute;
    top: ${calcRem(4)};
    left: ${calcRem(4)};
    z-index: 11;

    svg {
      width: ${calcRem(24)};
      height: ${calcRem(24)};
    }
  }
`;
const StAddImage = styled.label`
  cursor: pointer;
  input {
    display: none;
  }
  svg {
    width: ${calcRem(32)};
    height: ${calcRem(32)};
  }
`;
