import React, {
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  KeyboardEvent,
} from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { useRecoilValue, useRecoilState } from "recoil";

import { fontTheme } from "../../styles/theme";
import { calcRem } from "../../styles/theme";
import { lightTheme } from "../../styles/colors";

import {
  InputStatusType,
  ValidationType,
  isLightThemeType,
} from "../../types/etcTypes";
import { getDuplicatedId } from "../../api/memberApi";
import { debounceState, lightThemeState, signUpData } from "../../state/atom";
import {
  MEMBERNAME_MIN_LENGTH,
  MEMBERNAME_MAX_LENGTH,
} from "../../utils/validations";

import Input from "../elements/Input";
import Button from "../elements/Button";

import { ReactComponent as CheckCircle } from "../../assets/svg/check_circle.svg";

interface SignUpIdrProps extends React.HTMLAttributes<HTMLDivElement> {
  setStep: Dispatch<SetStateAction<number>>;
  setPercent: Dispatch<SetStateAction<number>>;
}

const VALIDATION: ValidationType[] = [
  {
    text: "영문 포함",
    validation: /^[a-zA-Z0-9]*[a-zA-Z][a-zA-Z0-9]*$/,
  },
  {
    text: "숫자 포함",
    validation: /\d/,
  },
  {
    text: `${MEMBERNAME_MIN_LENGTH}-${MEMBERNAME_MAX_LENGTH}자 이내`,
    validation: new RegExp(
      `^.{${MEMBERNAME_MIN_LENGTH},${MEMBERNAME_MAX_LENGTH}}$`
    ),
  },
];

type ValidType = {
  valid: boolean;
  isLightTheme: boolean;
};

type DuplicatedType = "default" | "success" | "duplicated";

const SignUpId = ({ setStep, setPercent }: SignUpIdrProps) => {
  const isLightTheme = useRecoilValue(lightThemeState);
  const debounce = useRecoilValue(debounceState);
  const [data, setData] = useRecoilState(signUpData);

  const [duplicated, setDuplicated] = useState<DuplicatedType>("default");
  const [status, setStatus] = useState<InputStatusType>("default");
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (data.memberName) {
      setValue(data.memberName);
    }
  }, []);

  const checkValidation = () => {
    return (
      VALIDATION.every((item) => item.validation.test(value)) &&
      duplicated === "success"
    );
  };

  const { data: duplicatedCheckData } = useQuery(
    ["duplicatedCheck", debounce, value],
    () => {
      if (debounce === "check" && value.length > 0) {
        return getDuplicatedId(value);
      } else {
        return "default";
      }
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (duplicatedData) => {
        if (duplicatedData === "default") {
          setDuplicated("default");
        } else {
          setDuplicated(duplicatedData ? "success" : "duplicated");
        }
      },
    }
  );

  const onClickNextStep = () => {
    if (checkValidation()) {
      setData({
        memberName: value,
        password: "",
      });
      setStep(2);
      setPercent(50);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onClickNextStep();
    }
  };

  return (
    <StContainer>
      <StTop>
        <Input
          labelText="아이디"
          status={status}
          setStatus={setStatus}
          value={value}
          setValue={setValue}
          maxLengthView={false}
          maxLength={MEMBERNAME_MAX_LENGTH}
          placeholder="아이디를 입력해주세요"
          inputId="member-name"
          onKeyDown={handleKeyDown}
        ></Input>
        <StValidContainer>
          {VALIDATION.map((item) => (
            <StValidFlex
              isLightTheme={isLightTheme}
              key={item.text}
              valid={value.length > 0 ? item.validation.test(value) : true}
            >
              <CheckCircle width="16px" height="16px" />
              <StvalidText>{item.text}</StvalidText>
            </StValidFlex>
          ))}
          <StValidFlex
            isLightTheme={isLightTheme}
            valid={duplicated === "success" || duplicated === "default"}
          >
            <CheckCircle width="16px" height="16px" />
            <StvalidText>중복되지 않은 아이디</StvalidText>
          </StValidFlex>
        </StValidContainer>
      </StTop>
      <StBottom>
        <StCautionText isLightTheme={isLightTheme}>
          아이디와 비밀번호는 찾을 수 없으니 주의해주세요
        </StCautionText>
        <Button
          btnStatus={checkValidation() ? "primary01" : "disabled"}
          clickHandler={onClickNextStep}
        >
          <span>다음</span>
        </Button>
      </StBottom>
    </StContainer>
  );
};

export default SignUpId;

const StContainer = styled.div`
  padding: ${calcRem(24)} 0 ${calcRem(76)} 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const StValidContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${calcRem(8)};
  padding-top: ${calcRem(4)};
  flex-wrap: wrap;
`;

const StValidFlex = styled.div<ValidType>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${calcRem(3)};
  span {
    color: ${({ valid, isLightTheme }) =>
      valid
        ? isLightTheme
          ? lightTheme.colors.primary02
          : lightTheme.colors.white
        : lightTheme.colors.error};
  }
  svg {
    fill: ${({ valid, isLightTheme }) =>
      valid
        ? isLightTheme
          ? lightTheme.colors.primary02
          : lightTheme.colors.white
        : lightTheme.colors.error};
  }
`;

const StvalidText = styled.span`
  letter-spacing: ${fontTheme.caption.letterSpacing};
  line-height: ${fontTheme.caption.lineHeight};
  font-size: ${fontTheme.caption.fontSize};
  font-weight: ${fontTheme.caption.fontWeight};
`;

const StCautionText = styled.span<isLightThemeType>`
  letter-spacing: ${fontTheme.caption.letterSpacing};
  line-height: ${fontTheme.caption.lineHeight};
  font-size: ${fontTheme.caption.fontSize};
  font-weight: ${fontTheme.caption.fontWeight};
  color: ${({ isLightTheme, theme }) =>
    isLightTheme ? theme.colors.primary01 : theme.colors.text02};
`;

const StBottom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${calcRem(28)};
`;

const StTop = styled.div`
  display: flex;
  flex-direction: column;
`;
