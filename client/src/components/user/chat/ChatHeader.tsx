import closeFill from "@iconify/icons-eva/close-fill";
import { Icon } from "@iconify/react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFinishOrder from "../../../hooks/qa/useFinishOrder";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { QuestionStatus } from "../../../types/QuestionStatus";
import BadgeStatus from "../../general/BadgeStatus";

interface ChatHeaderProps {
  avatar: string;
  username: string;
  isOnline: boolean;
  isQuestioner: boolean;
  orderStatus: QuestionStatus;
}

const StyledDiv = styled("div")(({ theme }) => ({
  flexShrink: 0,
  minHeight: 92,
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 3),
}));

export default function ChatHeader({
  avatar,
  username,
  isOnline,
  isQuestioner,
  orderStatus,
}: ChatHeaderProps): JSX.Element {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [toRateDialogOpen, setToRateDialogOpen] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const finishOrder = useFinishOrder();

  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  const handleToRateDialogOpen = () => {
    setToRateDialogOpen(true);
  };

  const handleToRateDialogClose = () => {
    setToRateDialogOpen(false);
  };

  const handleConfirm = async () => {
    handleConfirmDialogClose();
    const message = await finishOrder(id);
    if (message !== null) {
      enqueueSnackbar(message, {
        variant: "error",
        action: key => (
          <IconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </IconButton>
        ),
      });
    } else {
      handleToRateDialogOpen();
    }
  };

  const handleToRate = () => {
    navigate(`/user/dashboard/orders/${id}/rating`);
  };

  const handleNoToRate = () => {
    handleToRateDialogClose();
    if (isQuestioner) {
      navigate(PATH_DASHBOARD.orders);
    } else {
      navigate(PATH_DASHBOARD.questions);
    }
  };

  return (
    <StyledDiv>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ position: "relative" }}>
          <Avatar alt={username} src={avatar} />
          <BadgeStatus
            status={isOnline ? "online" : "offline"}
            sx={{ position: "absolute", right: 2, bottom: 2 }}
          />
        </Box>
        <Box sx={{ ml: 2 }}>
          <Typography variant="subtitle2">{username}</Typography>

          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {isOnline ? "??????" : "?????????"}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1 }} />
      {orderStatus === "CHATTING" && (
        <Button variant="text" color="error" onClick={handleConfirmDialogOpen}>
          ????????????
        </Button>
      )}

      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>?????????????????????</DialogTitle>
        <DialogContent>
          <DialogContentText>???????????????????????????????????????</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose}>??????</Button>
          <Button onClick={handleConfirm} autoFocus variant="contained">
            ??????
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={toRateDialogOpen} onClose={handleNoToRate}>
        <DialogTitle>????????????</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isQuestioner
              ? "?????????????????????????????????????????????????????????????????????????????????"
              : "??????????????????????????????????????????"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {isQuestioner && <Button onClick={handleNoToRate}>???????????????</Button>}
          {isQuestioner ? (
            <Button onClick={handleToRate} autoFocus variant="contained">
              ?????????
            </Button>
          ) : (
            <Button onClick={handleNoToRate}>??????</Button>
          )}
        </DialogActions>
      </Dialog>
    </StyledDiv>
  );
}
