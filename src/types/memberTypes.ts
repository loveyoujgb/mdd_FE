import { DiskType } from "./diskTypes";

export type MemberType = {
  createdAt: string;
  interest: string;
  introduce: string;
  isMe: boolean;
  likeCount: number;
  memberId: number;
  memberName: string;
  modifiedAt: string;
  nickname: string;
  profileImg: string;
  visitCount: number;
};

export type UserBookbarkDataType = {
  diskList: Array<DiskType>;
  isMine: boolean;
  memberId: number;
  memberName: string;
  nickname: string;
};
