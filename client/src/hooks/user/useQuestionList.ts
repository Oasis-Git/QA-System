import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { PATH_API_USER } from "../../routes/paths";
import { Question } from "../../types/Question";
import { QuestionStatus, statusName } from "../../types/QuestionStatus";

type Question_ = {
  title: string;
  questioner: string;
  respondent: string;
  timeout: string;
  status: { name: QuestionStatus };
  id: string;
};

const useQuestionList = (
  page: number,
  size: number
): [[Question[], number], () => void] => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [count, setCount] = useState(0);
  const refreshQuestions = useCallback(() => {
    axios
      .get(PATH_API_USER.questionsList, { params: { page, perpage: size } })
      .then(response => {
        const content = response.data.data.questions as Question_[];
        setQuestions(
          content.map(q_ => {
            const q: Question = {
              ...q_,
              status: statusName(q_.status.name),
            };
            return q;
          })
        );
        setCount(response.data.data.count);
      })
      .catch(exception => {
        console.log(exception);
        throw exception;
      });
  }, [page, size]);
  useEffect(refreshQuestions, [refreshQuestions]);
  return [[questions, count], refreshQuestions];
};
export default useQuestionList;
