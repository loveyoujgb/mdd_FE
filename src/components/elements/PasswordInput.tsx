import React, { Dispatch, SetStateAction, useState } from "react";
import styled, { css } from "styled-components";

import { InputStatusType } from "../../types/etcTypes";

import { calcRem, fontTheme } from "../../styles/theme";
import { lightTheme } from "../../styles/colors";

import Eye from "../../assets/svg/eye.svg";
import EyeSlash from "../../assets/svg/eye_slash.svg";

interface PasswordInputProps extends React.HTMLAttributes<HTMLDivElement> {
  labelText: string;
  bottomChildren?: React.ReactNode;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  status: InputStatusType;
  setStatus: React.Dispatch<React.SetStateAction<InputStatusType>>;
  maxLength?: number;
  placeholder: string;
  jc?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around";
  TopChildren?: React.ReactNode;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const PasswordInput = ({
  labelText,
  bottomChildren,
  status,
  setStatus,
  value,
  setValue,
  maxLength = 0,
  placeholder,
  jc = "space-between",
  TopChildren,
  onKeyDown = () => {},
}: PasswordInputProps) => {
  const [isMasked, setIsMasked] = useState(true);

  const handleMaskToggle = () => {
    setIsMasked(!isMasked);
  };

  return (
    <StContainer inputStatus={status}>
      <StFlex jc={jc}>
        <label htmlFor="password">{labelText}</label>
        {TopChildren}
      </StFlex>
      <StInputContainer inputStatus={status}>
        <StInput
          id="password"
          autoComplete="off"
          isMasked={isMasked}
          placeholder={placeholder}
          type="text"
          value={value}
          onChange={(e) => {
            const validation = /^[0-9\b]*$/;
            const input = e.target.value.substring(0, maxLength);
            if (value.length <= maxLength && validation.test(input)) {
              setValue(input);
            }
          }}
          onFocus={() => setStatus("focused")}
          onBlur={() => setStatus("default")}
          maxLength={maxLength}
          inputStatus={status}
          onKeyDown={onKeyDown}
        />
        <StEye onClick={handleMaskToggle} src={isMasked ? EyeSlash : Eye} />
      </StInputContainer>
      {bottomChildren}
    </StContainer>
  );
};

export default PasswordInput;

const StContainer = styled.div<{ inputStatus: InputStatusType }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${calcRem(4)};

  label {
    color: ${({ theme }) => theme.colors.primary05};
    letter-spacing: ${fontTheme.subtitle02.letterSpacing};
    line-height: ${fontTheme.subtitle02.lineHeight};
    font-size: ${fontTheme.subtitle02.fontSize};
    font-weight: ${fontTheme.subtitle02.fontWeight};
  }
`;

const StInputContainer = styled.div<{ inputStatus: InputStatusType }>`
  border-radius: 4px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${calcRem(12)} ${calcRem(12)} ${calcRem(12)} ${calcRem(16)};
  gap: ${calcRem(16)};
  border: 1px solid;
  border-color: ${({ theme, inputStatus }) => {
    switch (inputStatus) {
      case "default":
        return theme.colors.primary03;
      case "warning":
        return theme.colors.error;
      case "focused":
        return theme.colors.primary01;
      default:
        break;
    }
  }};
`;

const StInput = styled.input<{
  inputStatus: InputStatusType;
  isMasked: boolean;
}>`
  border: none;
  outline: none;
  background-color: transparent;
  box-shadow: none;
  appearance: none;
  width: 100%;
  color: ${({ theme, inputStatus }) => {
    switch (inputStatus) {
      case "default":
        return lightTheme.colors.text01;
      case "warning":
        return theme.colors.error;
      default:
        break;
    }
  }};
  letter-spacing: ${fontTheme.body02.letterSpacing};
  line-height: ${fontTheme.body02.lineHeight};
  font-size: ${fontTheme.body02.fontSize};
  font-weight: ${fontTheme.body02.fontWeight};
  ::placeholder {
    color: ${({ theme }) => theme.colors.text02};
  }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ${({ isMasked }) =>
    isMasked &&
    css`
      -webkit-text-security: disc;
      -moz-webkit-text-security: disc;
      -moz-text-security: disc;
    `};
`;

const StFlex = styled.div<{ jc: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ jc }) => jc};
  width: 100%;
  gap: ${calcRem(4)};
`;

const StEye = styled.img`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;
