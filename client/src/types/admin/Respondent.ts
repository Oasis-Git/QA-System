export type RespondentSummary = {
  username: string;
  description: string;
  fee: number;
  avatar: string;
  updatedAt: string | number | Date;
};

export type RespondentDetail = {
  username: string;
  specialities: Array<string>;
  fee: number;
  description: string;
  detail: string;
  avatar: string;
  updatedAt: string | number | Date;
};
