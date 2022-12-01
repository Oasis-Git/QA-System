import axios from "axios";
import { useEffect, useState } from "react";
import { PATH_API_QA } from "../../routes/paths";
import { ApiResponse } from "../../types/ApiResponse";
import { QuestionInfo } from "../../types/user/Chat";

const initialState: QuestionInfo = {
  answer: "加载中...",
  title: "加载中...",
  description: "加载中...",
};

const useQuestionInfo = (id: string): QuestionInfo => {
  const [question, setQuestion] = useState(initialState);

  useEffect(() => {
    axios.get(PATH_API_QA.questionInfo(id)).then(response => {
      const data = response.data as ApiResponse<QuestionInfo>;
      setQuestion(data.data);
    });
  }, [id]);

  return question;
};
export default useQuestionInfo;
