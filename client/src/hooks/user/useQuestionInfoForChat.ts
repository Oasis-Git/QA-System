import axios from "axios";
import { useEffect, useState } from "react";
import { PATH_API_USER } from "../../routes/paths";
import { ApiResponse } from "../../types/ApiResponse";
import { QuestionInfo } from "../../types/user/Chat";

const initialState: QuestionInfo = {
  title: "加载中...",
  description: "加载中...",
  answer: "加载中...",
};

const useQuestionInfoForChat = (id: string): QuestionInfo => {
  const [question, setQuestion] = useState(initialState);

  useEffect(() => {
    axios
      .get(PATH_API_USER.questionInfoForChat(id))
      .then(response => {
        const data = response.data as ApiResponse<QuestionInfo>;
        setQuestion(data.data);
      })
      .catch(exception => {
        console.log(exception);
        throw exception;
      });
  }, [id]);

  return question;
};
export default useQuestionInfoForChat;
