import assert from "assert";
import jwtDecode from "jwt-decode";
import { useSnackbar } from "notistack";
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { ContextType } from "../hooks/useAuthContext";

export type IsMeGuardOption = {
  isMe: boolean;
  redirectUrl: string;
  snackbarWarning?: string;
};

export default function IsMeGuard(
  auth: ContextType,
  { isMe, redirectUrl, snackbarWarning }: IsMeGuardOption,
  children: ReactNode
): JSX.Element {
  const { pathname } = useLocation();
  const { name = "" } = useParams();
  const [next, setNext] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const token = auth.getAccessToken();
  assert(token !== null);
  const { sub } = jwtDecode<{ sub: string }>(token);
  const myName = sub.substring(0, sub.lastIndexOf("@"));

  const rejected = (name === myName) !== isMe;

  useEffect(() => {
    if (rejected) {
      setNext(pathname);
      if (snackbarWarning !== undefined) {
        enqueueSnackbar(snackbarWarning, { variant: "warning" });
      }
    }
  }, [enqueueSnackbar, pathname, rejected, snackbarWarning]);

  if (rejected) {
    return <Navigate to={redirectUrl} />;
  }

  if (next !== null && pathname !== next) {
    const navigation = <Navigate to={next} />;
    setNext(null);
    return navigation;
  }

  return <>{children}</>;
}
