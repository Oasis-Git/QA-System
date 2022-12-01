import { ReactNode } from "react";
import useAuth from "../hooks/user/useAuth";
import { PATH_USER } from "../routes/paths";
import AuthGuard from "./AuthGuard";

export default function UserAuthGuard({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const auth = useAuth();

  return AuthGuard(auth, PATH_USER.login, children);
}
