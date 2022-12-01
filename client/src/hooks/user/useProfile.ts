import axios from "axios";
import { useEffect, useState } from "react";
import { PATH_API_USER, PATH_AVATAR_LOADING } from "../../routes/paths";
import { ApiResponse } from "../../types/ApiResponse";
import { Profile } from "../../types/user/Profile";

const initialState: Profile = {
  username: "加载中...",
  avatar: PATH_AVATAR_LOADING,
  email: "加载中...",
  location: "加载中...",
  contacts: {
    wechat: null,
    weibo: null,
  },
  respondentProfile: {
    description: "加载中...",
    specialities: [],
    rating: 0,
    answerCount: 0,
    fee: 0,
    detail: "加载中...",
    pinnedAnswers: [],
  },
};

const useProfile = (username: string): Profile => {
  const [profile, setProfile] = useState(initialState);

  useEffect(() => {
    axios
      .get(PATH_API_USER.profile(username))
      .then(response => {
        const data = response.data as ApiResponse<Profile>;
        setProfile(data.data);
      })
      .catch(exception => {
        console.log(exception);
        throw exception;
      });
  }, [username]);

  return profile;
};
export default useProfile;
