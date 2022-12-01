import axios from "axios";
import { useCallback } from "react";
import { PATH_API_QA } from "../../routes/paths";
import { handleAxiosException } from "../../utils/exception";

const useAcceptOrder = (): ((
  id: string,
  accept: boolean
) => Promise<null | string>) =>
  useCallback(async (id, accept) => {
    try {
      await axios.post(
        (accept ? PATH_API_QA.acceptOrder : PATH_API_QA.refuseOrder)(id)
      );
      return null;
    } catch (exception) {
      return handleAxiosException(exception);
    }
  }, []);
export default useAcceptOrder;
