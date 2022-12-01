import axios from "axios";
import { useEffect, useState } from "react";
import { PATH_API_USER, PATH_AVATAR_LOADING } from "../../routes/paths";
import useAuth from "./useAuth";

export type NavbarProfile = {
  readonly username: string;
  readonly email: string;
  readonly avatar: string;
};

const initialState: NavbarProfile = {
  username: "加载中...",
  email: "加载中...",
  avatar: PATH_AVATAR_LOADING,
};

const useNavbarProfile = (): NavbarProfile => {
  const auth = useAuth();
  const [profile, setProfile] = useState<NavbarProfile>(initialState);
  useEffect(() => {
    if (auth.isAuthenticated()) {
      axios
        .get(PATH_API_USER.navbar)
        .then(response => setProfile(response.data.data))
        .catch(exception => {
          console.log(exception);
          throw exception;
        });
    }
  }, [auth]);
  return profile;
};
export default useNavbarProfile;
