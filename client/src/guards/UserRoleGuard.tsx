import { ReactNode } from "react";
import useAuth from "../hooks/user/useAuth";
import { PATH_DASHBOARD } from "../routes/paths";
import SuperRoleGuard from "./SuperRoleGuard";

export default function UserRoleGuard({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const auth = useAuth();

  return SuperRoleGuard(
    auth,
    {
      allowSuper: false,
      redirectUrl: PATH_DASHBOARD.profile,
      snackbarWarning: "你已经成为回答者了",
    },
    children
  );
}
