import axios from "axios";
import { useEffect, useState } from "react";
import { PATH_API_ADMIN } from "../../routes/paths";
import { QuestionDetail } from "../../types/admin/Question";

const initialState: QuestionDetail = {
  id: "加载中...",
  title: "加载中...",
  questioner: "加载中...",
  respondent: "加载中...",
  createdAt: 0,
  description: "加载中...",
  questionerAvatar: "",
  respondentAvatar: "",
};

const useQuestionDetail = (id: string): QuestionDetail => {
  const [question, setQuestion] = useState(initialState);

  useEffect(() => {
    axios
      .get(PATH_API_ADMIN.question(id))
      .then(response => {
        setQuestion(response.data.data);
      })
      .catch(exception => {
        console.log(exception);
        throw exception;
      });
  }, [id]);
  return question;
};
export default useQuestionDetail;
