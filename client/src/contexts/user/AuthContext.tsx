import axios from "axios";
import { createContext, ReactNode, useCallback } from "react";
import useAuthContext, {
  ContextType as AuthContextType,
} from "../../hooks/useAuthContext";
import { actions as authActions } from "../../redux/slices/userAuth";
import { useSelector } from "../../redux/store";
import { PATH_API_USER } from "../../routes/paths";
import { handleAxiosException } from "../../utils/exception";

export type ContextType = AuthContextType & {
  register(
    username: string,
    email: string,
    password: string
  ): Promise<string | null>;
};

export const Context = createContext<ContextType | null>(null);

export const Provider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const authState = useSelector(state => state.userAuth);
  const auth = useAuthContext(
    authState,
    authActions,
    PATH_API_USER.login,
    PATH_API_USER.isSuper
  );

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      auth.logout();
      try {
        await axios.post(PATH_API_USER.register, {
          username,
          email,
          password,
        });
        return auth.login(username, password);
      } catch (exception) {
        return handleAxiosException(exception);
      }
    },
    [auth]
  );

  return (
    <Context.Provider
      value={{
        register,
        ...auth,
      }}
    >
      {children}
    </Context.Provider>
  );
};
