import axios from "axios";
import { useEffect, useState } from "react";
import { PATH_API_QA } from "../../routes/paths";
import { ApiResponse } from "../../types/ApiResponse";
import { QuestionStatus } from "../../types/QuestionStatus";

const useOrderStatus = (id: string): QuestionStatus => {
  const [status, setStatus] = useState<QuestionStatus>("CHATTING");

  useEffect(() => {
    axios
      .get(PATH_API_QA.status(id))
      .then(response => {
        const data = response.data as ApiResponse<{
          status: { name: QuestionStatus };
        }>;
        setStatus(data.data.status.name);
      })
      .catch(exception => {
        console.log(exception);
        throw exception;
      });
  }, [id]);

  return status;
};
export default useOrderStatus;
