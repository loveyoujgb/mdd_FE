// REST API
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getLoc, setLoc } from "../utils/localStorage";

const accessToken = getLoc("accessToken");

/* REQUEST WITHOUT ACCESSTOKEN                                                */
/* -------------------------------------------------------------------------- */
export const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

/* REQUEST WITH ACCESSTOKEN                                                   */
/* -------------------------------------------------------------------------- */
export const tokenInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
  withCredentials: true,
});

/* INTERCEPTOR                                                                */
/* -------------------------------------------------------------------------- */

export interface AuthDataType {
  memberName: string;
  password: string;
}

export const postJoin = async (postData: AuthDataType) => {
  try {
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/members/join`,
      postData
    );
    console.log(data);
    // return data;
  } catch (error: AxiosError | any) {
    console.log(error.response.data);
  }
};

export const postLogin = async (postData: AuthDataType) => {
  try {
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/members/login`,
      postData
    );
    console.log(data);
    setLoc("accessToken", data.accessToken);
    setLoc("nickname", data.memberInfo.nickname);
    setLoc("memberName", data.memberInfo.memberName);
    setLoc("memberId", data.memberInfo.memberId);
    // return data;
  } catch (error: AxiosError | any) {
    console.log(error.response.data);
  }
};
