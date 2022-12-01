import { AppBar, Container, Toolbar, Box } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { PATH_ADMIN } from "../../routes/paths";
import AdminAccountPopover from "./AdminAccountPopover";
import AdminMenu, { AdminMenuItemProps } from "./AdminMenu";

const MENU_ITEMS: AdminMenuItemProps[] = [
  {
    title: "问题审核",
    path: PATH_ADMIN.questions,
  },
  {
    title: "回答者审核",
    path: PATH_ADMIN.respondents,
  },
];

const BAR_DESKTOP = 88;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  backgroundColor: alpha(theme.palette.background.default, 0.72),
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  height: BAR_DESKTOP,
  transition: theme.transitions.create(["height", "background-color"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
}));

const StyledToolbarShadow = styled("div")(({ theme }) => ({
  left: 0,
  right: 0,
  bottom: 0,
  height: 24,
  zIndex: -1,
  margin: "auto",
  borderRadius: "50%",
  position: "absolute",
  width: `calc(100% - 48px)`,
  boxShadow: theme.customShadows.z8,
}));

export default function AdminNavbar(): JSX.Element {
  const [offsetTop, setOffsetTop] = useState(false);
  const isTop = 100;
  useEffect(() => {
    window.onscroll = () => {
      if (window.pageYOffset > isTop) {
        setOffsetTop(true);
      } else {
        setOffsetTop(false);
      }
    };
    return () => {
      window.onscroll = null;
    };
  }, [isTop]);

  return (
    <StyledAppBar>
      <StyledToolbar
        disableGutters
        sx={{
          ...(offsetTop && {
            bgcolor: "background.default",
            height: { md: BAR_DESKTOP - 16 },
          }),
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <AdminMenu offsetTop={offsetTop} menuItems={MENU_ITEMS} />

          <Box sx={{ flexGrow: 1 }} />

          <AdminAccountPopover />
        </Container>
      </StyledToolbar>
      {offsetTop && <StyledToolbarShadow />}
    </StyledAppBar>
  );
}
