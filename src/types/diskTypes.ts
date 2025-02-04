export const DISK_COLOR_LIST = [
  "PINK",
  "YELLOW",
  "SKYBLUE",
  "NEON_ORANGE",
  "PURPLE",
] as const;

export type DiskColorType = (typeof DISK_COLOR_LIST)[number];

export type NewDiskType = {
  diskName: string;
  content: string;
  diskColor: DiskColorType;
  // isPrivate: boolean;
  isBookmark: boolean;
};

export type DiskType = {
  content: string;
  createdAt: string;
  diskColor: DiskColorType;
  diskId: number;
  diskName: DiskColorType;
  diskOwnerId: number;
  diskOwnerNickname: string;
  image: DiskImgType[];
  isBookmark: boolean;
  isMine: boolean;
  isPrivate: boolean;
  likeCount: number;
  modifiedAt: string;
};

export type DiskListType = {
  diskList: DiskType[];
  isMine: boolean;
  memberId: number;
  memberName: string;
  nickname: string;
};

export type DiskImgType = {
  imgId: number | "new";
  imgUrl: string;
  createdAt?: string;
  modifiedAt?: string;
};

export type DiskPreviewType = {
  imgId: number | "new";
  imgUrl: string;
  index: number;
  createdAt?: string;
  modifiedAt?: string;
};

export type DiskMainImgType = {
  imgUrl: string;
  index: number;
};

export const DISK_BTN_LIST = [
  "like",
  "edit",
  "delete",
  "bookmark",
  "mode",
] as const;

export type DiskBtnType = (typeof DISK_BTN_LIST)[number];

export type DiskModeType = "gallery" | "text";
