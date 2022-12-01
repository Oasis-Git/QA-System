import axios from "axios";
import { useCallback } from "react";
import { PATH_API_USER } from "../../routes/paths";
import { handleAxiosException } from "../../utils/exception";

const useResetPassword = (): ((
  username: string,
  password: string
) => Promise<string | null>) =>
  useCallback(async (username, password) => {
    try {
      await axios.post(PATH_API_USER.resetPassword, {
        username,
        password,
      });
      return null;
    } catch (exception) {
      return handleAxiosException(exception);
    }
  }, []);
export default useResetPassword;
