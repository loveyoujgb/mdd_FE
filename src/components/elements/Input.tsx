import React, { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import { useSetRecoilState } from "recoil";

import { debounceState } from "../../state/atom";
import { InputStatusType } from "../../types/etcTypes";
import { calcRem, fontTheme } from "../../styles/theme";
import { lightTheme } from "../../styles/colors";

interface InputProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: string;
  labelText: string;
  bottomText?: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  status: InputStatusType;
  setStatus: React.Dispatch<React.SetStateAction<InputStatusType>>;
  maxLength?: number;
  maxLengthView?: boolean;
  placeholder: string;
  jc?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around";
  TopChildren?: React.ReactNode;
  inputId: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Input = ({
  type = "text",
  labelText,
  bottomText,
  status,
  setStatus,
  value,
  setValue,
  maxLength,
  maxLengthView = true,
  placeholder,
  jc = "space-between",
  TopChildren,
  inputId = "",
  onKeyDown = () => {},
}: InputProps) => {
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const setDebounce = useSetRecoilState(debounceState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (inputId === "member-name") {
      setDebounce("default");
    }

    const inputValue = e.target.value;
    if (inputId === "member-name" || inputId === "nickname") {
      setValue(inputValue.replace(/\s+/g, "").substring(0, maxLength));
    } else {
      setValue(inputValue.substring(0, maxLength));
    }

    if (timerId) {
      clearTimeout(timerId);
    }

    const newTimerId = setTimeout(() => {
      if (value.length > 0 && inputId === "member-name") {
        setDebounce("check");
      }
    }, 300);
    setTimerId(newTimerId);
  };

  return (
    <StContainer inputStatus={status}>
      <StFlex jc={jc}>
        <label htmlFor={inputId}>{labelText}</label>
        {TopChildren}
      </StFlex>
      <StInputContainer inputStatus={status}>
        <StInput
          id={inputId}
          autoComplete="off"
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={(e) => handleChange(e)}
          onFocus={() => setStatus("focused")}
          onBlur={() => setStatus("default")}
          maxLength={maxLength}
          inputStatus={status}
          onKeyDown={onKeyDown}
        />
        {maxLength && maxLengthView && (
          <StTextLength>
            {value.length}/{maxLength}
          </StTextLength>
        )}
      </StInputContainer>
      <StDesc inputStatus={status}>{bottomText}</StDesc>
    </StContainer>
  );
};

export default Input;

const StContainer = styled.div<{ inputStatus: InputStatusType }>`
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

const StInput = styled.input<{ inputStatus: InputStatusType }>`
  border: none;
  outline: none;
  background-color: transparent;
  box-shadow: none;
  appearance: none;
  width: 100%;

  color: ${({ theme, inputStatus }) => {
    switch (inputStatus) {
      case "default":
        return lightTheme.colors.primary05;
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
`;

const StDesc = styled.span<{ inputStatus: InputStatusType }>`
  letter-spacing: ${fontTheme.caption.letterSpacing};
  line-height: ${fontTheme.caption.lineHeight};
  font-size: ${fontTheme.caption.fontSize};
  font-weight: ${fontTheme.caption.fontWeight};
  color: ${({ theme, inputStatus }) => {
    switch (inputStatus) {
      case "warning":
        return theme.colors.error;
      default:
        return theme.colors.text02;
    }
  }};
`;

const StFlex = styled.div<{ jc: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ jc }) => jc};
  width: 100%;
  gap: ${calcRem(4)};
`;

const StTextLength = styled.div`
  color: ${({ theme }) => theme.colors.text02};
  letter-spacing: ${fontTheme.body02.letterSpacing};
  line-height: ${fontTheme.body02.lineHeight};
  font-size: ${fontTheme.body02.fontSize};
  font-weight: ${fontTheme.body02.fontWeight};
`;
