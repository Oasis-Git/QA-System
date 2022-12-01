import axios from "axios";
import { useEffect, useState } from "react";
import { PATH_API_USER } from "../../routes/paths";
import { ApiResponse } from "../../types/ApiResponse";
import { QuestionerInfo } from "../../types/user/Chat";

const initialState: QuestionerInfo = {
  username: "加载中...",
  avatar: "加载中...",
  email: "加载中...",
  isOnline: false,
};

const useChatInfoForRespondent = (id: string): QuestionerInfo => {
  const [info, setInfo] = useState(initialState);

  useEffect(() => {
    axios
      .get(PATH_API_USER.chatInfoForRespondent(id))
      .then(response => {
        const data = response.data as ApiResponse<QuestionerInfo>;
        setInfo(data.data);
      })
      .catch(exception => {
        console.log(exception);
        throw exception;
      });
  }, [id]);

  return info;
};
export default useChatInfoForRespondent;
