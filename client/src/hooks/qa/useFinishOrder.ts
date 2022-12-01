import axios from "axios";
import { useCallback } from "react";
import { PATH_API_QA } from "../../routes/paths";
import { handleAxiosException } from "../../utils/exception";

const useFinishOrder = (): ((id: string) => Promise<null | string>) =>
  useCallback(async id => {
    try {
      await axios.post(PATH_API_QA.finishOrder(id));
      return null;
    } catch (exception) {
      return handleAxiosException(exception);
    }
  }, []);
export default useFinishOrder;
