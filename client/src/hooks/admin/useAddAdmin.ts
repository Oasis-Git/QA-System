import axios from "axios";
import { useCallback } from "react";
import { PATH_API_ADMIN } from "../../routes/paths";
import { ApiResponse } from "../../types/ApiResponse";
import { handleAxiosException } from "../../utils/exception";

type LoginFormData = {
  username: string;
  password?: string;
};

const useAddAdmin = (): ((
  username: string[]
) => Promise<LoginFormData[] | string>) =>
  useCallback(async usernames => {
    try {
      const response = await axios.post(PATH_API_ADMIN.addAdmin, {
        usernames,
      });
      const data = response.data as ApiResponse<{ admins: LoginFormData[] }>;
      return data.data.admins;
    } catch (exception) {
      return handleAxiosException(exception);
    }
  }, []);
export default useAddAdmin;
