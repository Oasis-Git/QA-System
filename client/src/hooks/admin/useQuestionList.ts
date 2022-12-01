import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { PATH_API_ADMIN } from "../../routes/paths";
import { QuestionSummary } from "../../types/admin/Question";
import { QuestionStatus } from "../../types/QuestionStatus";

const useQuestionList = (
  status: QuestionStatus,
  page: number,
  size: number
): [[QuestionSummary[], number], () => void] => {
  const [questions, setQuestions] = useState<QuestionSummary[]>([]);
  const [count, setCount] = useState(0);

  const refreshQuestions = useCallback(() => {
    axios
      .get(PATH_API_ADMIN.questionList, { params: { status, page, size } })
      .then(response => {
        setQuestions(response.data.data.content);
        setCount(response.data.data.totalElements);
      })
      .catch(exception => {
        console.log(exception);
        throw exception;
      });
  }, [page, size, status]);
  useEffect(refreshQuestions, [refreshQuestions]);
  return [[questions, count], refreshQuestions];
};
export default useQuestionList;
