import axios from "axios";
import jwtDecode from "jwt-decode";
import { useCallback, useEffect } from "react";
import { Actions, State as AuthState } from "../redux/slices/auth";
import { useDispatch } from "../redux/store";
import { ApiResponse } from "../types/ApiResponse";
import { handleAxiosException } from "../utils/exception";

export type ContextType = {
  login(username: string, password: string): Promise<string | null>;
  logout(): void;
  getAccessToken(): string | null;
  isAuthenticated(): boolean;
  isSuper(): boolean;
  getUsername(): string;
};

const useAuthContext = <State extends AuthState>(
  state: State,
  actions: Actions<State>,
  loginUrl: string,
  isSuperUrl: string
): ContextType => {
  const dispatch = useDispatch();

  const logout = useCallback(() => {
    dispatch(actions.logout());
  }, [actions, dispatch]);

  const login = useCallback(
    async (username: string, password: string) => {
      logout();
      try {
        const response = await axios.post(loginUrl, {
          username,
          password,
        });
        const { data } = response.data as ApiResponse<{
          token: string;
          isSuper: boolean;
        }>;
        dispatch(
          actions.login({
            accessToken: data.token,
            ...data,
          })
        );
        return null;
      } catch (exception) {
        return handleAxiosException(exception);
      }
    },
    [actions, dispatch, loginUrl, logout]
  );

  const getAccessToken = useCallback(
    () => state.accessToken,
    [state.accessToken]
  );

  const isAuthenticated = useCallback(
    () => getAccessToken() !== null,
    [getAccessToken]
  );

  const isSuper = useCallback(() => state.isSuper, [state.isSuper]);

  const getUsername = useCallback(() => {
    if (state.accessToken === null) {
      return "加载中...";
    } else {
      const { sub } = jwtDecode<{ sub: string }>(state.accessToken);
      return sub.substring(0, sub.lastIndexOf("@"));
    }
  }, [state.accessToken]);

  useEffect(() => {
    if (state.accessToken !== null) {
      const payload = jwtDecode<{ exp: number }>(state.accessToken);
      const currentTime = Date.now() / 1000;
      if (currentTime > payload.exp) {
        logout();
      } else {
        dispatch(actions.initialize());
        axios
          .get(isSuperUrl)
          .then(response => {
            const data = response.data as ApiResponse<{ isSuper: boolean }>;
            dispatch(actions.setIsSuper(data.data));
          })
          .catch(exception => {
            console.log(exception);
            throw exception;
          });
      }
    }
  }, [actions, dispatch, isSuperUrl, logout, state.accessToken]);

  return {
    login,
    logout,
    getAccessToken,
    isAuthenticated,
    isSuper,
    getUsername,
  };
};
export default useAuthContext;
