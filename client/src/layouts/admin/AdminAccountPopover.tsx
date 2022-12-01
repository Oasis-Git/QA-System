import roundVpnKey from "@iconify/icons-ic/round-vpn-key";
import { Icon } from "@iconify/react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  MenuItem,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { MIconButton } from "../../components/@material-extend";
import MenuPopover from "../../components/general/MenuPopover";
import useAuth from "../../hooks/admin/useAuth";
import { PATH_ADMIN } from "../../routes/paths";

export default function AdminAccountPopover(): JSX.Element {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const auth = useAuth();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleLogout = () => {
    auth.logout();
    alert("登出成功");
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
        <Avatar alt="admin" />
      </MIconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {auth.getUsername()}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <MenuItem
          to={PATH_ADMIN.changePassword}
          component={RouterLink}
          onClick={handleClose}
          sx={{ typography: "body2", py: 1, px: 2.5 }}
        >
          <Box
            component={Icon}
            icon={roundVpnKey}
            sx={{
              mr: 2,
              width: 24,
              height: 24,
            }}
          />
          修改密码
        </MenuItem>

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button
            fullWidth
            color="inherit"
            variant="outlined"
            onClick={handleLogout}
          >
            登出
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
