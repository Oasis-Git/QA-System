import axios from "axios";
import { useEffect, useState } from "react";
import { PATH_API_USER } from "../../routes/paths";
import { ApiResponse } from "../../types/ApiResponse";
import { MyRole } from "../../types/user/Chat";

const useChatRole = (id: string): MyRole => {
  const [role, setRole] = useState<MyRole>("questioner");

  useEffect(() => {
    axios
      .get(PATH_API_USER.chatRole(id))
      .then(response => {
        const data = response.data as ApiResponse<MyRole>;
        setRole(data.data);
      })
      .catch(exception => {
        console.log(exception);
        throw exception;
      });
  }, [id]);

  return role;
};
export default useChatRole;
