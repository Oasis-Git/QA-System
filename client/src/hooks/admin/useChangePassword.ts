import axios from "axios";
import { useCallback } from "react";
import { PATH_API_ADMIN } from "../../routes/paths";
import { handleAxiosException } from "../../utils/exception";

const useChangePassword = (): ((
  oldPassword: string,
  newPassword: string
) => Promise<string | null>) =>
  useCallback(async (oldPassword, newPassword) => {
    try {
      await axios.put(PATH_API_ADMIN.changePassword, {
        oldPassword,
        newPassword,
      });
      return null;
    } catch (exception) {
      return handleAxiosException(exception);
    }
  }, []);
export default useChangePassword;
