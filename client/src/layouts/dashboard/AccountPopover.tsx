import homeFill from "@iconify/icons-eva/home-fill";
import personFill from "@iconify/icons-eva/person-fill";
import settings2Fill from "@iconify/icons-eva/settings-2-fill";
import { Icon } from "@iconify/react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  MenuItem,
  Typography,
} from "@mui/material";
// material
import { alpha } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useRef, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
// components
import { MIconButton } from "../../components/@material-extend";
import MenuPopover from "../../components/general/MenuPopover";
// hooks
import useIsMountedRef from "../../hooks/useIsMountedRef";
import useAuth from "../../hooks/user/useAuth";
import useNavbarProfile from "../../hooks/user/useNavbarProfile";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";

const MENU_OPTIONS = [
  {
    label: "首页",
    icon: homeFill,
    linkTo: "/",
  },
  {
    label: "个人主页",
    icon: personFill,
    linkTo: PATH_DASHBOARD.profile,
  },
  {
    label: "设置",
    icon: settings2Fill,
    linkTo: PATH_DASHBOARD.settings.editBasicInfo,
  },
];

export default function AccountPopover(): JSX.Element {
  const navigate = useNavigate();
  const anchorRef = useRef(null);
  const { username, email, avatar } = useNavbarProfile();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const auth = useAuth();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      auth.logout();
      if (isMountedRef.current) {
        navigate("/");
        handleClose();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Unable to logout", { variant: "error" });
    }
  };

  return (
    <>
      <MIconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: theme => alpha(theme.palette.grey[900], 0.72),
            },
          }),
        }}
      >
        <Avatar src={avatar} />
      </MIconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {username}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {MENU_OPTIONS.map(option => (
          <MenuItem
            key={option.label}
            to={option.linkTo}
            component={RouterLink}
            onClick={handleClose}
            sx={{ typography: "body2", py: 1, px: 2.5 }}
          >
            <Box
              component={Icon}
              icon={option.icon}
              sx={{
                mr: 2,
                width: 24,
                height: 24,
              }}
            />

            {option.label}
          </MenuItem>
        ))}

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button
            fullWidth
            color="inherit"
            variant="outlined"
            onClick={handleLogout}
          >
            退出登录
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
