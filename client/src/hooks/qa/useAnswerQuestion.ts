import axios from "axios";
import { useCallback } from "react";
import { PATH_API_QA } from "../../routes/paths";
import { handleAxiosException } from "../../utils/exception";

const useAnswerQuestion = (): ((
  id: string,
  content: string
) => Promise<string | null>) =>
  useCallback(async (id, content) => {
    try {
      await axios.post(PATH_API_QA.answerQuestion(id), {
        content,
      });
      return null;
    } catch (exception) {
      return handleAxiosException(exception);
    }
  }, []);
export default useAnswerQuestion;
