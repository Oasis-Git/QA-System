import { Duration } from "moment";

export type Args = {
  timeout: {
    beforeAccept: Duration;
    acceptToAnswer: Duration;
    answerToChat: Duration;
    chat: Duration;
  };
  fee: number;
};
