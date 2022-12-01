import axios from "axios";
import { useCallback } from "react";
import { PATH_API_QA } from "../../routes/paths";
import { ApiResponse } from "../../types/ApiResponse";
import { NewQuestion } from "../../types/qa/NewQuestion";
import { handleAxiosException } from "../../utils/exception";

const usePostQuestion = (): ((
  question: NewQuestion
) => Promise<{ id: string } | string>) =>
  useCallback(async question => {
    try {
      const response = await axios.post(PATH_API_QA.postQuestion, question);
      return (response.data as ApiResponse<{ id: string }>).data;
    } catch (exception) {
      return handleAxiosException(exception);
    }
  }, []);
export default usePostQuestion;
