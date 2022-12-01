import axios from "axios";
import { useCallback } from "react";
import { PATH_API_ADMIN } from "../../routes/paths";
import { Role } from "../../types/user/Role";
import { handleAxiosException } from "../../utils/exception";

const useSetUserRole = (): ((
  username: string,
  role: Role
) => Promise<string | null>) =>
  useCallback(async (username, role) => {
    try {
      await axios.put(PATH_API_ADMIN.userRole(username), { role });
      return null;
    } catch (exception) {
      return handleAxiosException(exception);
    }
  }, []);
export default useSetUserRole;
