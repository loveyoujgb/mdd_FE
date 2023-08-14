import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

import AppLayout from "../components/layout/AppLayout";

import SignUpHeader from "../components/signUp/SignUpHeader";
import SignUpId from "../components/signUp/SignUpId";
import SignUpPassword from "../components/signUp/SignUpPassword";

import MonitorFilled from "../assets/img/monitor_filled.png";

import { postJoin, postLogin } from "../api/api";
import { MOBILE_MAX_W, calcRem, fontTheme } from "../styles/theme";
import Input from "../components/elements/Input";
import { InputStatusType } from "../types/etcTypes";
import Button from "../components/elements/Button";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/elements/PasswordInput";
import { useQuery } from "@tanstack/react-query";

const LoginPage = () => {
  const navigate = useNavigate();
  const [duplicated, setDupliceted] = useState(true);
  const [idStatus, setIdStatus] = useState<InputStatusType>("default");
  const [passwordStatus, setPasswordStatus] =
    useState<InputStatusType>("default");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AppLayout>
      <StContainer>
        <StMonitor src={MonitorFilled} />
        <Input
          labelText="아이디"
          status={idStatus}
          setStatus={setIdStatus}
          TopChildren={
            idStatus === "warning" && (
              <StErrorText>존재하지 않는 아이디에요.</StErrorText>
            )
          }
          value={id}
          setValue={setId}
          maxLengthView={false}
          maxLength={20}
          placeholder="아이디를 입력해주세요"
        ></Input>
        <StInputContainer>
          <PasswordInput
            type="number"
            labelText="비밀번호"
            status={passwordStatus}
            setStatus={setPasswordStatus}
            TopChildren={
              passwordStatus === "warning" && (
                <StErrorText>비밀번호가 맞지 않아요.</StErrorText>
              )
            }
            bottomChildren={
              passwordStatus === "warning" && (
                <StPasswordErrorText>
                  오직 숫자로만 입력해주세요.
                </StPasswordErrorText>
              )
            }
            value={password}
            setValue={setPassword}
            maxLength={20}
            placeholder="비밀번호를 입력해주세요"
          ></PasswordInput>
        </StInputContainer>
        <Button
          btnStatus="disabled"
          // btnStatus="primary01"
          clickHandler={() => {
            // navigate("/signUp");
            setPasswordStatus("warning");
            setIdStatus("warning");
            postLogin({
              memberName: id,
              password: password,
            });
          }}
        >
          <span>접속하기</span>
        </Button>
        <StSignUpText>아이디가 없어요</StSignUpText>
      </StContainer>
    </AppLayout>
  );
};

export default LoginPage;

const StContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.bg};
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${calcRem(48)} ${calcRem(32)} ${calcRem(27)} ${calcRem(32)};
  @media screen and (max-width: ${MOBILE_MAX_W}px) {
    padding: ${calcRem(48)} ${calcRem(16)} ${calcRem(27)} ${calcRem(16)};
  }
`;

const StInputContainer = styled.div`
  width: 100%;
  padding: ${calcRem(16)} 0 ${calcRem(52)} 0;
`;

const StMonitor = styled.img`
  width: 251px;
  height: auto;
  padding-bottom: ${calcRem(32)};
`;

const StErrorText = styled.span`
  letter-spacing: ${fontTheme.body02.letterSpacing};
  line-height: ${fontTheme.body02.lineHeight};
  font-size: ${fontTheme.body02.fontSize};
  font-weight: ${fontTheme.body02.fontWeight};
  color: ${({ theme }) => theme.colors.error};
`;

const StPasswordErrorText = styled.span`
  position: absolute;
  bottom: ${calcRem(-20)};
  letter-spacing: ${fontTheme.caption.letterSpacing};
  line-height: ${fontTheme.caption.lineHeight};
  font-size: ${fontTheme.caption.fontSize};
  font-weight: ${fontTheme.caption.fontWeight};
  color: ${({ theme }) => theme.colors.error};
`;

const StSignUpText = styled.span`
  padding-top: ${calcRem(32)};
  letter-spacing: ${fontTheme.button.letterSpacing};
  line-height: ${fontTheme.button.lineHeight};
  font-size: ${fontTheme.button.fontSize};
  font-weight: ${fontTheme.button.fontWeight};
  color: ${({ theme }) => theme.colors.primary01};
  text-decoration-line: underline;
`;
