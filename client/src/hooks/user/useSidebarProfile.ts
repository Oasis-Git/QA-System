import axios from "axios";
import { useEffect, useState } from "react";
import { PATH_API_USER } from "../../routes/paths";
import useAuth from "./useAuth";

export type SidebarProfile = {
  readonly username: string;
  readonly identity: string;
};

const initialState: SidebarProfile = {
  username: "加载中...",
  identity: "加载中...",
};

const useSidebarProfile = (): SidebarProfile => {
  const auth = useAuth();
  const [profile, setProfile] = useState<SidebarProfile>(initialState);
  useEffect(() => {
    if (auth.isAuthenticated()) {
      axios
        .get(PATH_API_USER.sidebar)
        .then(response => setProfile(response.data.data))
        .catch(exception => {
          console.log(exception);
          throw exception;
        });
    }
  }, [auth]);
  return profile;
};
export default useSidebarProfile;
