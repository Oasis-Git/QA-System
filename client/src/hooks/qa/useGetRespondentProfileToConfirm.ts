import axios from "axios";
import { useEffect, useState } from "react";
import { PATH_API_QA, PATH_AVATAR_LOADING } from "../../routes/paths";
import { ApiResponse } from "../../types/ApiResponse";
import { RespondentInConfirming } from "../../types/Respondent";

const initialState: RespondentInConfirming = {
  avatar: PATH_AVATAR_LOADING,
  specialities: ["加载中..."],
  fee: -1,
};

const useGetRespondentProfileToConfirm = (
  username: string
): RespondentInConfirming => {
  const [profile, setProfile] = useState(initialState);

  useEffect(() => {
    axios
      .get(PATH_API_QA.getRespondentProfileToConfirm(username))
      .then(response => {
        const { data: profile } =
          response.data as ApiResponse<RespondentInConfirming>;
        setProfile(profile);
      })
      .catch(exception => {
        console.log(exception);
        throw exception;
      });
  });

  return profile;
};
export default useGetRespondentProfileToConfirm;
