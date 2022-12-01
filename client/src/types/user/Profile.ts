export type RespondentProfile = {
  description: string;
  specialities: string[];
  rating: number;
  answerCount: number;
  pinnedAnswers: { title: string; answeredAt: Date }[];
  fee: number;
  detail: string;
};

export type Profile = {
  username: string;
  avatar: string;
  email: string;
  location: string;
  contacts: {
    wechat: string | null;
    weibo: string | null;
  };
  respondentProfile: RespondentProfile | null;
};
