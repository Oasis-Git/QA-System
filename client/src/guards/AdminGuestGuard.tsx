import { ReactNode } from "react";
import useAuth from "../hooks/admin/useAuth";
import { PATH_ADMIN } from "../routes/paths";
import GuestGuard from "./GuestGuard";

export default function AdminGuestGuard({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const auth = useAuth();

  return GuestGuard(auth, PATH_ADMIN.questions, children);
}
