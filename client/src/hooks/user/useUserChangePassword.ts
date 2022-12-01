import axios from "axios";
import { useCallback } from "react";
import { PATH_API_USER } from "../../routes/paths";
import { handleAxiosException } from "../../utils/exception";

const useUserChangePassword = (): ((
  oldPassword: string,
  newPassword: string
) => Promise<string | null>) =>
  useCallback(async (oldPassword, newPassword) => {
    try {
      await axios.post(PATH_API_USER.changePassword, {
        oldPassword,
        newPassword,
      });
      return null;
    } catch (exception) {
      return handleAxiosException(exception);
    }
  }, []);
export default useUserChangePassword;
