import axios from "axios";
import { useEffect, useState } from "react";
import { PATH_API_QA } from "../../routes/paths";
import { ApiResponse } from "../../types/ApiResponse";
import { QuestionDetail } from "../../types/Question";

const initialState: QuestionDetail = {
  title: "加载中...",
  description: "加载中...",
  answer: "加载中...",
};

const useOpenQuestionDetail = (id: string): QuestionDetail => {
  const [question, setQuestion] = useState(initialState);

  useEffect(() => {
    axios
      .get(PATH_API_QA.openDetail(id))
      .then(response => {
        const data = response.data as ApiResponse<QuestionDetail>;
        setQuestion(data.data);
      })
      .catch(exception => {
        console.log(exception);
        throw exception;
      });
  }, [id]);

  return question;
};
export default useOpenQuestionDetail;
