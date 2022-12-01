import { ReactNode } from "react";
import AdminNavbar from "./AdminNavbar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps): JSX.Element {
  return (
    <>
      <AdminNavbar />
      <div>{children}</div>
    </>
  );
}
