import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { PATH_API_USER, PATH_AVATAR_LOADING } from "../../routes/paths";
import { ApiResponse } from "../../types/ApiResponse";
import { handleAxiosException } from "../../utils/exception";

type Profile = {
  wechat: string;
  weibo: string;
  location: string;
  avatar: string;
};

const initialState: Profile = {
  wechat: "加载中...",
  weibo: "加载中...",
  location: "加载中...",
  avatar: PATH_AVATAR_LOADING,
};

const useGeneralInfo = (): [
  Profile,
  (profile: Profile) => Promise<null | string>
] => {
  const [profile, setProfile] = useState(initialState);

  const getProfile = useCallback(async () => {
    try {
      const response = await axios.get(PATH_API_USER.updateProfile);
      return (response.data as ApiResponse<Profile>).data;
    } catch (exception) {
      console.log(exception);
      throw exception;
    }
  }, []);

  useEffect(() => {
    getProfile().then(setProfile);
  }, [getProfile]);

  const updateProfile = useCallback(
    async (profile: Profile): Promise<null | string> => {
      try {
        await axios.post(PATH_API_USER.updateProfile, profile);
        return null;
      } catch (exception) {
        return handleAxiosException(exception);
      } finally {
        const profile = await getProfile();
        setProfile(profile);
      }
    },
    [getProfile]
  );

  return [profile, updateProfile];
};
export default useGeneralInfo;
