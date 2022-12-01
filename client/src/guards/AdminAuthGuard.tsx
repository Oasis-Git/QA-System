import { ReactNode } from "react";
import useAuth from "../hooks/admin/useAuth";
import { PATH_ADMIN } from "../routes/paths";
import AuthGuard from "./AuthGuard";

export default function AdminAuthGuard({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const auth = useAuth();

  return AuthGuard(auth, PATH_ADMIN.login, children);
}
