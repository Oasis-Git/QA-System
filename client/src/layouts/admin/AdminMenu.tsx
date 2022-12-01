import { Link, LinkProps, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/admin/useAuth";
import { PATH_ADMIN } from "../../routes/paths";

export interface AdminMenuItemProps {
  title: string;
  path: string;
  offsetTop?: boolean;
}

interface AdminMenuProps {
  offsetTop: boolean;
  menuItems: AdminMenuItemProps[];
}

interface RouterLinkProps extends LinkProps {
  component?: ReactNode;
  to?: string;
  end?: boolean;
}

const StyledLink = styled(Link)<RouterLinkProps>(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.primary,
  marginRight: theme.spacing(3),
  marginLeft: theme.spacing(2),
  transition: theme.transitions.create("opacity", {
    duration: theme.transitions.duration.shortest,
  }),
  "&:hover": {
    opacity: 0.48,
    textDecoration: "none",
  },
}));

function AdminMenuItem({
  title,
  path,
  offsetTop,
}: AdminMenuItemProps): JSX.Element {
  return (
    <StyledLink
      to={path}
      component={NavLink}
      end={path === "/"}
      sx={{
        ...(offsetTop && { color: "text.primary" }),
        "&.active": {
          color: "primary.main",
        },
      }}
    >
      {title}
    </StyledLink>
  );
}

export default function AdminMenu({
  offsetTop,
  menuItems,
}: AdminMenuProps): JSX.Element {
  const auth = useAuth();
  return (
    <Stack direction="row">
      {menuItems.map((item, idx) => (
        <AdminMenuItem
          key={idx}
          title={item.title}
          path={item.path}
          offsetTop={offsetTop}
        />
      ))}
      {auth.isSuper() && (
        <AdminMenuItem
          title="添加管理员"
          path={PATH_ADMIN.addAdmin}
          offsetTop={offsetTop}
        />
      )}
      {auth.isSuper() && (
        <AdminMenuItem
          title="系统参数"
          path={PATH_ADMIN.setArgs}
          offsetTop={offsetTop}
        />
      )}
    </Stack>
  );
}
