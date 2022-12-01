import axios from "axios";
import { useCallback } from "react";
import { PATH_API_USER } from "../../routes/paths";
import { handleAxiosException } from "../../utils/exception";

const useDeposit = (): ((amount: number) => Promise<null | string>) =>
  useCallback(async amount => {
    try {
      await axios.post(PATH_API_USER.deposit, { amount });
      return null;
    } catch (exception) {
      return handleAxiosException(exception);
    }
  }, []);
export default useDeposit;
