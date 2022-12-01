export type QuestionStatus =
  | "待审核"
  | "待接单"
  | "回答中"
  | "已回答"
  | "聊天中"
  | "审核不通过"
  | "订单失败"
  | "订单完成";

export type Question = {
  title: string;
  questioner: string;
  respondent: string;
  timeout: string;
  status: QuestionStatus;
  id: string;
};

export type QuestionDetail = {
  title: string;
  description: string;
  answer: string;
};

export type QuestionInfo = {
  title: string;
  description: string;
};
