import { ReactNode } from "react";
import useAuth from "../hooks/user/useAuth";
import IsMeGuard from "./IsMeGuard";

export type UserIsMeGuardProps = {
  isMe: boolean;
  redirectUrl: string;
  snackbarWarning?: string;
  children: ReactNode;
};

export default function UserIsMeGuard({
  children,
  ...options
}: UserIsMeGuardProps): JSX.Element {
  const auth = useAuth();

  return IsMeGuard(auth, options, children);
}
