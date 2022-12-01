import { useSnackbar } from "notistack";
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ContextType } from "../hooks/useAuthContext";

export type SuperGuardOption = {
  allowSuper: boolean;
  redirectUrl: string;
  snackbarWarning?: string;
};

export default function SuperRoleGuard(
  auth: ContextType,
  { allowSuper, redirectUrl, snackbarWarning }: SuperGuardOption,
  children: ReactNode
): JSX.Element {
  const { pathname } = useLocation();
  const [next, setNext] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const rejected = auth.isSuper() !== allowSuper;
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
