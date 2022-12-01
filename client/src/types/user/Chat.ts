export type ChatMessageType = "TEXT" | "FILE" | "IMG";
export type MyRole = "questioner" | "respondent" | "unknown";

export type ChatMessage = {
  messageType: ChatMessageType;
  isMe: boolean;
  content: string;
  timestamp: Date;
};

export type ChatInfoForQuestioner = {
  respondent: RespondentInfo;
  question: QuestionInfo;
};

export type ChatInfoForRespondent = {
  questioner: QuestionerInfo;
  question: QuestionInfo;
};

export type RespondentInfo = {
  username: string;
  description: string;
  avatar: string;
  wechat: string;
  email: string;
  weibo: string;
  specialities: Array<string>;
  isOnline: boolean;
};

export type QuestionerInfo = {
  username: string;
  avatar: string;
  email: string;
  isOnline: boolean;
};

export type QuestionInfo = {
  title: string;
  description: string;
  answer: string;
};
