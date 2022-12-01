import axios from "axios";
import { useEffect, useState } from "react";
import { PATH_API_USER } from "../../routes/paths";
import { ApiResponse } from "../../types/ApiResponse";
import { RespondentInfo } from "../../types/user/Chat";

const initialState: RespondentInfo = {
  username: "加载中...",
  description: "加载中...",
  avatar: "",
  wechat: "加载中...",
  weibo: "加载中...",
  email: "加载中...",
  specialities: [],
  isOnline: false,
};

const useChatInfoForQuestioner = (id: string): RespondentInfo => {
  const [info, setInfo] = useState(initialState);

  useEffect(() => {
    axios
      .get(PATH_API_USER.chatInfoForQuestioner(id))
      .then(response => {
        const data = response.data as ApiResponse<RespondentInfo>;
        setInfo(data.data);
      })
      .catch(exception => {
        console.log(exception);
        throw exception;
      });
  }, [id]);

  return info;
};
export default useChatInfoForQuestioner;
