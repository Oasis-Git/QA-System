import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { ContextType } from "../hooks/useAuthContext";

export default function GuestGuard(
  auth: ContextType,
  indexUrl: string,
  children: ReactNode
): JSX.Element {
  if (auth.isAuthenticated()) {
    return <Navigate to={indexUrl} />;
  }

  return <>{children}</>;
}
