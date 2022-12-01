import axios from "axios";
import { createContext, ReactNode, useCallback, useEffect } from "react";
import useAuthContext, {
  ContextType as AuthContextType,
} from "../../hooks/useAuthContext";
import { actions as authActions } from "../../redux/slices/adminAuth";
import { useDispatch, useSelector } from "../../redux/store";
import { PATH_API_ADMIN } from "../../routes/paths";
import { ApiResponse } from "../../types/ApiResponse";

export type ContextType = AuthContextType & {
  isActivated: () => boolean;
};

export const Context = createContext<ContextType | null>(null);

export function Provider({ children }: { children: ReactNode }): JSX.Element {
  const dispatch = useDispatch();
  const authState = useSelector(state => state.adminAuth);
  const auth = useAuthContext(
    authState,
    authActions,
    PATH_API_ADMIN.login,
    PATH_API_ADMIN.isSuper
  );

  const isActivated = useCallback(
    () => authState.activated,
    [authState.activated]
  );

  useEffect(() => {
    if (auth.isAuthenticated()) {
      axios.get(PATH_API_ADMIN.activated).then(response => {
        const data = response.data as ApiResponse<{ activated: boolean }>;
        dispatch(authActions.setActivated({ ...data.data }));
      });
    }
  }, [auth, dispatch]);

  return (
    <Context.Provider value={{ isActivated, ...auth }}>
      {children}
    </Context.Provider>
  );
}
