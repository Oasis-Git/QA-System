import axios from "axios";
import { useEffect, useState } from "react";
import { PATH_API_ADMIN } from "../../routes/paths";
import { RespondentDetail } from "../../types/admin/Respondent";

const initialState: RespondentDetail = {
  username: "加载中...",
  specialities: [],
  fee: 0,
  description: "加载中...",
  detail: "加载中...",
  avatar: "加载中...",
  updatedAt: 0,
};

const useRespondentDetail = (username: string): RespondentDetail => {
  const [respondent, setRespondent] = useState(initialState);

  useEffect(() => {
    axios
      .get(PATH_API_ADMIN.respondent(username))
      .then(response => {
        setRespondent(response.data.data);
      })
      .catch(exception => {
        console.log(exception);
        throw exception;
      });
  }, [username]);
  return respondent;
};
export default useRespondentDetail;
