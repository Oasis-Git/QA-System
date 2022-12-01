import { useSnackbar } from "notistack";
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/admin/useAuth";
import { PATH_ADMIN } from "../routes/paths";

export default function AdminActivateGuard({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { pathname } = useLocation();
  const [next, setNext] = useState<string | null>(null);
  const auth = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const rejected = !auth.isActivated();
  useEffect(() => {
    if (rejected) {
      enqueueSnackbar("首次登录请修改默认密码", { variant: "warning" });
      setNext(pathname);
    }
  }, [enqueueSnackbar, pathname, rejected]);

  if (rejected) {
    return <Navigate to={PATH_ADMIN.changePassword} />;
  }

  if (next !== null && pathname !== next) {
    const navigation = <Navigate to={next} />;
    setNext(null);
    return navigation;
  }

  return <>{children}</>;
}
