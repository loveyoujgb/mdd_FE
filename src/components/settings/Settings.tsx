import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";

import ModalLayout from "../layout/ModalLayout";
import IconConverter from "./IconConverter";
import Button from "../elements/Button";
import { getLoc, removeLoc, setLoc } from "../../utils/localStorage";
import { logClickEvent } from "../../utils/googleAnalytics";
import {
  lightThemeState,
  loginState,
  logoutToastState,
  routeState,
  signUpState,
  unregisterToastState,
} from "../../state/atom";
import { deleteUser } from "../../api/memberApi";
import { MOBILE_MAX_W, WINDOW_W, calcRem, fontTheme } from "../../styles/theme";
import { lightTheme } from "../../styles/colors";

import DiskMask3 from "../../assets/img/disk_mask_3.png";
import { ReactComponent as Link } from "../../assets/svg/link.svg";
import { ReactComponent as CloseCircle } from "../../assets/svg/close_circle.svg";
import { removeCookie } from "../../utils/cookie";

export type SettingIconType = "letter" | "bug" | "heart" | "candles" | "logout";
type SettingsListType = {
  title: string;
  content: string;
  icon: SettingIconType;
};

const SETTINGS_LIST: SettingsListType[] = [
  {
    title: "서비스 평가하기",
    content: "개선해야 할 점이나 좋았던 점이 있으신가요?",
    icon: "letter",
  },
  {
    title: "버그 제보하기",
    content: "버그를 찾으셨다면 알려주세요!",
    icon: "bug",
  },
  {
    title: "제작팀 보기",
    content: "열심히 만든 제작팀이 궁금하다면 👀",
    icon: "heart",
  },
  {
    title: "라이트/다크 모드",
    content: "라이트 모드 적용 중이에요",
    icon: "candles",
  },
  {
    title: "로그아웃",
    content: "",
    icon: "logout",
  },
];

const TEAM_POSITION = [
  "PO",
  "디자이너",
  "프론트엔드 개발",
  "백엔드 개발",
] as const;

type MemberType = {
  name: string;
  url: string;
};

type TeamListType = {
  position: (typeof TEAM_POSITION)[number];
  member: MemberType[];
};

const TEAM_LIST: TeamListType[] = [
  {
    position: "PO",
    member: [
      {
        name: "조효은",
        url: "",
      },
    ],
  },
  {
    position: "디자이너",
    member: [
      {
        name: "손하영",
        url: "https://www.linkedin.com/in/hyeg/",
      },
    ],
  },
  {
    position: "프론트엔드 개발",
    member: [
      {
        name: "김미리",
        url: "https://github.com/loveyoujgb",
      },
      {
        name: "배근아",
        url: "https://github.com/green9930",
      },
    ],
  },
  {
    position: "백엔드 개발",
    member: [{ name: "이태민", url: "https://github.com/philomonx1" }],
  },
];

const Settings = () => {
  const [openUnregisterModal, setOpenUnregisterModal] = useState(false);
  const [openTeamModal, setOpenTeamModal] = useState(false);

  const [isLightTheme, setIsLightTheme] = useRecoilState(lightThemeState);
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const [isSignUp, setIsSignUp] = useRecoilState(signUpState);
  const setRoute = useSetRecoilState(routeState);
  const setOpenLogoutToast = useSetRecoilState(logoutToastState);
  const setOpenUnregisterToast = useSetRecoilState(unregisterToastState);

  const navigate = useNavigate();

  const { mutate: handleUnregister } = useMutation(deleteUser, {
    onSuccess: () => {
      removeLoc("accessToken");
      removeLoc("memberId");
      removeLoc("nickname");
      removeLoc("refreshToken");
      removeLoc("memberName");
      setRoute(true);
      setIsLogin(false);
      setIsSignUp(false);
      setOpenUnregisterToast(true);
      // 탈퇴하기 완료
      logClickEvent({
        action: "CONFIRM_UNREGISTER",
        category: "setting",
        label: "Confirm Unregister ",
      });
      navigate("/");
    },
  });

  const clickHandler = (name: SettingIconType) => {
    switch (name) {
      case "letter":
        window.open("https://forms.gle/nQzwvDN6vDBHQNid6");
        return;
      case "bug":
        window.open("https://forms.gle/VZZXzuVkgBWkBeRN9");
        return;
      case "heart":
        setOpenTeamModal(true);
        // 제작팀 보기
        logClickEvent({
          action: "VIEW_PRODUCTION_TEAM",
          category: "setting",
          label: "View Production Team",
        });
        return;
      case "candles":
        setIsLightTheme((prev) => !prev);
        setLoc(
          "theme",
          getLoc("theme") === "lightMode" ? "darkMode" : "lightMode"
        );
        return;
      case "logout":
        removeLoc("accessToken");
        removeLoc("memberId");
        removeLoc("nickname");
        removeLoc("refreshToken");
        removeLoc("memberName");
        setRoute(true);
        setIsLogin(false);
        setIsSignUp(false);
        setOpenLogoutToast(true);
        navigate("/login");
        // 로그아웃
        logClickEvent({
          action: "LOUGOUT",
          category: "setting",
          label: "Click Logout Button",
        });
        removeCookie("visit");
        return;
      default:
        return;
    }
  };

  const handleLink = (target: string) => window.open(target);

  return (
    <StContainer>
      <StList>
        {SETTINGS_LIST.map((val) => {
          const { title, content, icon } = val;
          if (!isLogin && !isSignUp && icon === "logout") {
            return;
          }
          return (
            <li key={title}>
              <div onClick={() => clickHandler(icon)}>
                {IconConverter(icon)}
                <StTitle>{title}</StTitle>
              </div>
              {content.length ? (
                <StContent>
                  {title === "라이트/다크 모드" && !isLightTheme
                    ? "다크 모드 적용 중이에요"
                    : content}
                </StContent>
              ) : (
                <></>
              )}
            </li>
          );
        })}
      </StList>
      {isLogin || isSignUp ? (
        <StUnregister
          isLightTheme={isLightTheme}
          onClick={() => {
            setOpenUnregisterModal(true);
            // 탈퇴하기 버튼 클릭 시
            logClickEvent({
              action: "UNREGISTER_BUTTON",
              category: "setting",
              label: "Click Unregister Button",
            });
          }}
        >
          <span>회원탈퇴</span>
        </StUnregister>
      ) : (
        <></>
      )}

      {/* 제작팀 보기 */}
      {openTeamModal ? (
        <ModalLayout
          width={WINDOW_W < MOBILE_MAX_W ? "358px" : "537px"}
          height="auto"
          bgc="transparent"
        >
          <div>
            <StModal>
              <h2>MDD 제작팀</h2>
              <StTeamTable>
                <tbody>
                  {TEAM_LIST.map((val, idx) => {
                    return (
                      <tr key={idx}>
                        <StPositionTd>{val.position}</StPositionTd>
                        <StMemberTd>
                          {val.member.map((el, i) => {
                            const isClickable = el.url ? true : false;
                            return (
                              <StMember
                                key={i}
                                isClickable={isClickable}
                                onClick={() =>
                                  isClickable ? handleLink(el.url) : null
                                }
                              >
                                <span>{el.name}</span>
                                {isClickable ? (
                                  <Link fill={lightTheme.colors.primary02} />
                                ) : (
                                  <></>
                                )}
                              </StMember>
                            );
                          })}
                        </StMemberTd>
                      </tr>
                    );
                  })}
                </tbody>
              </StTeamTable>
            </StModal>
            <StBtnContainer>
              <Button
                btnStatus="primary02"
                clickHandler={() => setOpenTeamModal(false)}
              >
                <StBtnText>
                  <CloseCircle />
                  <span>닫기</span>
                </StBtnText>
              </Button>
            </StBtnContainer>
          </div>
        </ModalLayout>
      ) : (
        <></>
      )}

      {/* 회원탈퇴 */}
      {openUnregisterModal ? (
        <ModalLayout
          width={WINDOW_W < MOBILE_MAX_W ? "358px" : "537px"}
          height="auto"
          bgc="transparent"
        >
          <div>
            <StModal>
              <h2>회원탈퇴</h2>
              <img src={DiskMask3} alt="unregister-icon" />
              <StUnregisterText>
                탈퇴시 디스크와 좋아요 등 모든 데이터가 삭제되며 공유된 링크로
                더이상 회원님의 홈을 볼 수 없어요. 그래도 탈퇴하시겠어요?
              </StUnregisterText>
            </StModal>
            <StBtnContainer>
              <Button btnStatus="unregister" clickHandler={handleUnregister}>
                <span>탈퇴하기</span>
              </Button>
              <Button
                btnStatus="primary01"
                clickHandler={() => setOpenUnregisterModal(false)}
              >
                <span>다시 생각해보기</span>
              </Button>
            </StBtnContainer>
          </div>
        </ModalLayout>
      ) : (
        <></>
      )}
    </StContainer>
  );
};

export default Settings;

const StContainer = styled.div`
  padding-top: ${calcRem(50)};
`;

const StList = styled.ul`
  margin-bottom: ${calcRem(24)};

  li {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${calcRem(4)};
    padding: ${calcRem(24)} ${calcRem(16)};
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary03};

    div {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: ${calcRem(8)};
      cursor: pointer;

      svg {
        width: ${calcRem(36)};
        height: ${calcRem(36)};
      }
    }
  }
`;

const StTitle = styled.span`
  color: ${({ theme }) => theme.colors.text01};
  line-height: ${fontTheme.display01.lineHeight};
  letter-spacing: ${fontTheme.display01.letterSpacing};
  font-size: ${fontTheme.display01.fontSize};
  font-weight: ${fontTheme.display01.fontWeight};
  font-family: "NanumSquareNeo";
`;

const StContent = styled.span`
  color: ${({ theme }) => theme.colors.text02};
  line-height: ${fontTheme.caption.lineHeight};
  letter-spacing: ${fontTheme.caption.letterSpacing};
  font-size: ${fontTheme.caption.fontSize};
  font-weight: ${fontTheme.caption.fontWeight};
`;

const StModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${calcRem(16)};
  padding: ${calcRem(24)} ${calcRem(16)};
  background-color: ${({ theme }) => theme.colors.bg};
  border: 2px solid ${({ theme }) => theme.colors.primary01};
  border-radius: ${calcRem(12)};

  h2 {
    color: ${({ theme }) => theme.colors.text01};
    line-height: ${fontTheme.display01.lineHeight};
    letter-spacing: ${fontTheme.display01.letterSpacing};
    font-size: ${fontTheme.display01.fontSize};
    font-weight: ${fontTheme.display01.fontWeight};
    font-family: "NanumSquareNeo";
  }

  img {
    width: ${calcRem(68)};
    height: ${calcRem(68)};
  }
`;

const StTeamTable = styled.table`
  border-collapse: separate;
  border-spacing: ${calcRem(16)} ${calcRem(12)};
`;

const StPositionTd = styled.td`
  color: ${({ theme }) => theme.colors.text03};
  line-height: ${fontTheme.subtitle02.lineHeight};
  letter-spacing: ${fontTheme.subtitle02.letterSpacing};
  font-size: ${fontTheme.subtitle02.fontSize};
  font-weight: ${fontTheme.subtitle02.fontWeight};
`;

const StMemberTd = styled.td`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${calcRem(8)};
`;

const StMember = styled.div<{ isClickable: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${calcRem(4)};
  height: ${calcRem(24)};
  cursor: ${({ isClickable }) => (isClickable ? "pointer" : "default")};

  span {
    color: ${({ theme }) => theme.colors.text01};
    line-height: ${fontTheme.body02.lineHeight};
    letter-spacing: ${fontTheme.body02.letterSpacing};
    font-size: ${fontTheme.body02.fontSize};
    font-weight: ${fontTheme.body02.fontWeight};
  }

  svg {
    width: ${calcRem(24)};
    height: ${calcRem(24)};
  }
`;

const StUnregister = styled.div<{ isLightTheme: boolean }>`
  padding: 0 ${calcRem(16)};
  text-decoration: underline;
  color: ${({ isLightTheme, theme }) =>
    isLightTheme ? theme.colors.primary02 : theme.colors.primary01};
  line-height: ${fontTheme.button.lineHeight};
  letter-spacing: ${fontTheme.button.letterSpacing};
  font-size: ${fontTheme.button.fontSize};
  font-weight: ${fontTheme.button.fontWeight};
  cursor: pointer;
`;

const StUnregisterText = styled.span`
  text-align: center;
  word-break: keep-all;
  color: ${({ theme }) => theme.colors.text01};
  line-height: ${fontTheme.body01.lineHeight};
  letter-spacing: ${fontTheme.body01.letterSpacing};
  font-size: ${fontTheme.body01.fontSize};
  font-weight: ${fontTheme.body01.fontWeight};
`;

const StBtnContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${calcRem(8)};
  margin-top: ${calcRem(16)};
`;

const StBtnText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${calcRem(8)};

  svg {
    width: ${calcRem(24)};
    height: ${calcRem(24)};
  }
`;
