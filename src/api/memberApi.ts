import axios, { AxiosError } from "axios";
import { setLoc } from "../utils/localStorage";
import { instance, tokenInstance } from "./api";

export interface AuthData {
  memberName: string;
  password: string;
}

export const postJoin = async (postData: AuthData) => {
  try {
    const res = await instance.post("/api/v1/members/join", {
      memberName: postData.memberName,
      password: postData.password,
    });
    const accessToken = res.headers.accesstoken;
    const refreshToken = res.headers.refreshtoken;
    const data = res.data.memberInfo;
    setLoc("accessToken", accessToken);
    setLoc("refreshToken", refreshToken);
    setLoc("nickname", data.nickname);
    setLoc("memberName", data.memberName);
    setLoc("memberId", data.memberId);
    return res.data.memberInfo;
  } catch (error: AxiosError | any) {
    const status = error.response.status;
    const errorMessage = error.response.data.errorMessage;
    // 이미 사용중인 MemberName error code = 409
    if (status === 409) {
      window.alert(
        "이미 사용중인 MemberName 입니다. 회원가입을 다시 진행해 주세요."
      );
      window.location.reload();
    } else if (status === 400) {
      window.alert(errorMessage);
      window.location.reload();
    }
    throw error;
  }
};

export const getDuplicatedId = async (memberName: string) => {
  try {
    const { data } = await instance.get(`/api/v1/members/check/${memberName}`);
    return data;
  } catch (err: AxiosError | any) {
    throw err;
  }
};

export const postLogin = async (postData: AuthData) => {
  try {
    const res = await instance.post("/api/v1/members/login", postData);
    const accessToken = res.headers.accesstoken;
    const refreshToken = res.headers.refreshtoken;
    const data = res.data.memberInfo;
    setLoc("accessToken", accessToken);
    setLoc("refreshToken", refreshToken);
    setLoc("nickname", data.nickname);
    setLoc("memberName", data.memberName);
    setLoc("memberId", data.memberId);
    return res;
  } catch (err: AxiosError | any) {
    throw err;
  }
};

export const getUserInfo = async (memberId: string) => {
  try {
    const res = await tokenInstance.get(`/api/v1/members/${memberId}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const patchMyInfo = async (data: any) => {
  try {
    await tokenInstance.patch("/api/v1/members", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        responseType: "blob",
      },
    });
  } catch (err) {
    throw err;
  }
};

export const checkNicknameDuplicated = async (data: string) => {
  try {
    const res = await instance.get(`/api/v1/members/check/nick/${data}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const postUserLike = async (memberId: string) => {
  try {
    const res = await instance.post(`/api/v1/members/like/${memberId}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const deleteUser = async () => {
  try {
    const res = await tokenInstance.delete(`/api/v1/members`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const postVisitCount = async (memberId: string) => {
  try {
    const res = await tokenInstance.post(`/api/v1/members/view/${memberId}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};
