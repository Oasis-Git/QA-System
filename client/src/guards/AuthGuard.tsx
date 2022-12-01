import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ContextType } from "../hooks/useAuthContext";

export default function AuthGuard(
  auth: ContextType,
  loginUrl: string,
  children: ReactNode
): JSX.Element {
  const { pathname } = useLocation();
  const [next, setNext] = useState<string | null>(null);

  const rejected = !auth.isAuthenticated();
  useEffect(() => {
    if (rejected) {
      setNext(pathname);
    }
  }, [pathname, rejected]);

  if (rejected) {
    return <Navigate to={loginUrl} />;
  }

  if (next !== null && pathname !== next) {
    const navigation = <Navigate to={next} />;
    setNext(null);
    return navigation;
  }

  return <>{children}</>;
}
