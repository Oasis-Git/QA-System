import { ReactNode } from "react";
import useAuth from "../hooks/user/useAuth";
import { PATH_DASHBOARD } from "../routes/paths";
import GuestGuard from "./GuestGuard";

export default function UserGuestGuard({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const auth = useAuth();

  return GuestGuard(auth, PATH_DASHBOARD.profile, children);
}
