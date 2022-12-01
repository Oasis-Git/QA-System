import axios from "axios";
import { useCallback } from "react";
import { PATH_API_QA } from "../../routes/paths";
import { handleAxiosException } from "../../utils/exception";

const useRateOrder = (): ((
  id: string,
  rating: number
) => Promise<null | string>) =>
  useCallback(async (id, rating) => {
    try {
      await axios.post(PATH_API_QA.rateOrder(id), { rating });
      return null;
    } catch (exception) {
      return handleAxiosException(exception);
    }
  }, []);
export default useRateOrder;
