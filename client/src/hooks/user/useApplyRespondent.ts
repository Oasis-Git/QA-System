import axios from "axios";
import { useCallback } from "react";
import { PATH_API_USER } from "../../routes/paths";
import { handleAxiosException } from "../../utils/exception";

type Profile = {
  specialities: string[];
  fee: number;
  description: string;
  detail: string;
};

const useApplyRespondent = (): ((profile: Profile) => Promise<null | string>) =>
  useCallback(async profile => {
    try {
      await axios.post(PATH_API_USER.apply, profile);
      return null;
    } catch (exception) {
      return handleAxiosException(exception);
    }
  }, []);
export default useApplyRespondent;
