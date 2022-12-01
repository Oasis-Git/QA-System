import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { PATH_API_USER } from "../../routes/paths";
import { ApiResponse } from "../../types/ApiResponse";
import { handleAxiosException } from "../../utils/exception";

type Profile = {
  fee: number;
  specialities: string[];
  about: string; // 命名可以统一吗？？？
  detail: string;
};

const initialState: Profile = {
  fee: -1,
  specialities: [],
  about: "加载中...",
  detail: "加载中...",
};

const useUpdateRespondentProfile = (): [
  Profile,
  (profile: Profile) => Promise<null | string>
] => {
  const [profile, setProfile] = useState(initialState);

  useEffect(() => {
    axios
      .get(PATH_API_USER.updateRespondentProfile)
      .then(response => {
        const data = response.data as ApiResponse<Profile>;
        setProfile(data.data);
      })
      .catch(exception => {
        console.log(exception);
        throw exception;
      });
  }, []);

  const updateProfile = useCallback(async (profile: Profile) => {
    try {
      console.log("debug_updateprofile" + JSON.stringify(profile));
      await axios.post(PATH_API_USER.updateRespondentProfile, profile);
      return null;
    } catch (exception) {
      return handleAxiosException(exception);
    }
  }, []);

  return [profile, updateProfile];
};
export default useUpdateRespondentProfile;
