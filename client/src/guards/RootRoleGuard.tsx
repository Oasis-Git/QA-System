import { ReactNode } from "react";
import useAuth from "../hooks/admin/useAuth";
import SuperRoleGuard from "./SuperRoleGuard";

export function RootRoleGuard({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const auth = useAuth();

  return SuperRoleGuard(
    auth,
    {
      allowSuper: true,
      redirectUrl: "403", // TODO
    },
    children
  );
}
