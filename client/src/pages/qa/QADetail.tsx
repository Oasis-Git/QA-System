import {
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
// material
import { styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import HeaderBreadcrumbs from "../../components/general/HeaderBreadcrumbs";
import Markdown from "../../components/general/Markdown";
// components
import Page from "../../components/general/Page";
import useFinishOrder from "../../hooks/qa/useFinishOrder";
import useGotoChat from "../../hooks/qa/useGotoChat";
import useOrderStatus from "../../hooks/qa/useOrderStatus";
import useQuestionDetail from "../../hooks/qa/useQuestionDetail";
import useChatRole from "../../hooks/user/useChatRole";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export default function QADetail(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const { id = "" } = useParams(); //订单编号
  const { title, description, answer } = useQuestionDetail(id);
  const finishOrder = useFinishOrder();
  const gotoChat = useGotoChat();
  const location = useLocation();
  const isQuestioner = location.pathname.includes("orders");
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const orderStatus = useOrderStatus(id);
  const myRole = useChatRole(id);
  const headerLinks =
    myRole === "questioner"
      ? [{ name: "我的订单", href: PATH_DASHBOARD.orders }, { name: id }]
      : [
          { name: "我回答的问题", href: PATH_DASHBOARD.questions },
          { name: id },
        ];

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleToRate = () => {
    navigate(`/user/dashboard/orders/${id}/rating`);
  };

  const handleNoToRate = () => {
    handleDialogClose();
    navigate(PATH_DASHBOARD.orders);
  };

  return (
    <Page title="问答详情">
      <Container maxWidth={"lg"}>
        <HeaderBreadcrumbs heading="问答详情" links={headerLinks} />

        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Typography variant="h3" gutterBottom>
              {title}
            </Typography>

            <div>
              <LabelStyle>问题描述</LabelStyle>
              <Markdown>{description}</Markdown>
            </div>

            <div>
              <LabelStyle>回答</LabelStyle>
              <Markdown>{answer}</Markdown>
            </div>

            {isQuestioner &&
              (orderStatus === "ANSWERED" || orderStatus === "CHATTING") && (
                <Stack direction="row" justifyContent="center">
                  <Button
                    onClick={async () => {
                      const message =
                        orderStatus === "CHATTING" ? null : await gotoChat(id);
                      if (message === null) {
                        navigate(`/user/dashboard/chat/${id}`);
                      } else {
                        enqueueSnackbar(message, { variant: "error" });
                      }
                    }}
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ mr: 1.5 }}
                  >
                    {"聊天咨询"}
                  </Button>

                  <Button
                    onClick={async () => {
                      const message = await finishOrder(id);
                      if (message === null) {
                        enqueueSnackbar("订单结束成功", { variant: "success" });
                        handleDialogOpen();
                      } else {
                        enqueueSnackbar(message, { variant: "error" });
                      }
                    }}
                    fullWidth
                    variant="contained"
                    size="large"
                    color="warning"
                    sx={{ ml: 1.5 }}
                  >
                    {"结束订单"}
                  </Button>
                </Stack>
              )}
          </Stack>
        </Card>
      </Container>

      <Dialog open={dialogOpen} onClose={handleNoToRate}>
        <DialogTitle>订单结束</DialogTitle>
        <DialogContent>
          <DialogContentText>
            本订单已经完成，愿意花几分钟对本次问答服务进行评价吗？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNoToRate}>不了，谢谢</Button>
          <Button onClick={handleToRate} autoFocus variant="contained">
            去评价
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
