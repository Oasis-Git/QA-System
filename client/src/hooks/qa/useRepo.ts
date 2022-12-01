import axios from "axios";
import { useEffect, useState } from "react";
import { PATH_API_QA } from "../../routes/paths";
import { ApiResponse } from "../../types/ApiResponse";
import { QuestionRepo } from "../../types/qa/Question";

const useRepo = (page: number, perPage: number): [QuestionRepo[], number] => {
  const [questions, setQuestions] = useState<QuestionRepo[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    axios
      .get(PATH_API_QA.repo, { params: { page, perPage } })
      .then(response => {
        const data = response.data as ApiResponse<{
          questions: QuestionRepo[];
          page: number; // wtf???
        }>;
        setQuestions(data.data.questions);
        setCount(data.data.page);
      })
      .catch(exception => {
        console.log(exception);
        throw exception;
      });
  }, [page, perPage]);

  return [questions, count];
};
export default useRepo;
