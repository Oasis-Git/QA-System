import axios from "axios";
import { useCallback } from "react";
import { PATH_API_USER } from "../../routes/paths";
import { ApiResponse } from "../../types/ApiResponse";
import { handleAxiosException } from "../../utils/exception";

const useValidateResetPasswordEmail = (): ((
  email: string
) => Promise<{ username: string } | string>) =>
  useCallback(async email => {
    try {
      const response = await axios.post(
        PATH_API_USER.validateResetPasswordEmail,
        {
          email,
        }
      );
      return (response.data as ApiResponse<{ username: string }>).data;
    } catch (exception) {
      return handleAxiosException(exception);
    }
  }, []);
export default useValidateResetPasswordEmail;
