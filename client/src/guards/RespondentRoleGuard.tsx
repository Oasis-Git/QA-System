import { ReactNode } from "react";
import useAuth from "../hooks/user/useAuth";
import { PATH_DASHBOARD } from "../routes/paths";
import SuperRoleGuard from "./SuperRoleGuard";

export default function RespondentRoleGuard({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const auth = useAuth();

  return SuperRoleGuard(
    auth,
    {
      allowSuper: true,
      redirectUrl: PATH_DASHBOARD.apply,
      snackbarWarning: "请先申请成为回答者",
    },
    children
  );
}
