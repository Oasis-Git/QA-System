export type User = {
  id: string;
  displayName: string;
  wechat: string;
  password: string;
  photoURL: File | string;
  weibo: string | null;
  country: string | null;
  address: string | null;
  about: string | null;
  role: string;
};
