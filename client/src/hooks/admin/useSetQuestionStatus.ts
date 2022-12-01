import axios from "axios";
import { useCallback } from "react";
import { PATH_API_ADMIN } from "../../routes/paths";
import { QuestionStatus } from "../../types/QuestionStatus";
import { handleAxiosException } from "../../utils/exception";

const useSetQuestionStatus = (): ((
  id: string,
  status: QuestionStatus
) => Promise<string | null>) =>
  useCallback(async (id, status) => {
    try {
      await axios.put(PATH_API_ADMIN.questionStatus(id), {
        status,
      });
      return null;
    } catch (exception) {
      return handleAxiosException(exception);
    }
  }, []);
export default useSetQuestionStatus;
