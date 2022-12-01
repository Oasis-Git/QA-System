import { QuestionStatus as QuestionsStatus_ } from "./Question";

export type QuestionStatus =
  | "CENSORING"
  | "EDITING"
  | "ACCEPTING"
  | "ANSWERING"
  | "ANSWERED"
  | "CHATTING"
  | "FAILED"
  | "FINISHED";

export const statusName = (status: QuestionStatus): QuestionsStatus_ => {
  switch (status) {
    case "CENSORING":
      return "待审核";
    case "EDITING":
      return "审核不通过";
    case "ACCEPTING":
      return "待接单";
    case "ANSWERING":
      return "回答中";
    case "ANSWERED":
      return "已回答";
    case "CHATTING":
      return "聊天中";
    case "FAILED":
      return "订单失败";
    case "FINISHED":
      return "订单完成";
  }
};
