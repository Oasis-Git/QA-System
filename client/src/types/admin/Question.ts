export type QuestionSummary = {
  id: string;
  title: string;
  questioner: string;
  respondent: string;
  createdAt: Date | number | string;
};

export type QuestionDetail = {
  id: string;
  title: string;
  questioner: string;
  respondent: string;
  createdAt: Date | number | string;
  description: string;
  questionerAvatar: string;
  respondentAvatar: string;
};
