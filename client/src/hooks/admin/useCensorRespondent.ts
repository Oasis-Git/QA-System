import axios from "axios";
import { useCallback } from "react";
import { PATH_API_ADMIN } from "../../routes/paths";
import { handleAxiosException } from "../../utils/exception";

const useCensorRespondent = (): ((
  username: string,
  approved: boolean
) => Promise<null | string>) =>
  useCallback(async (username, approved) => {
    try {
      await axios.put(PATH_API_ADMIN.censorRespondent(username), {
        approved,
      });
      return null;
    } catch (exception) {
      return handleAxiosException(exception);
    }
  }, []);
export default useCensorRespondent;
