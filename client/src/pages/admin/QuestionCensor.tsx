import closeFill from "@iconify/icons-eva/close-fill";
import { Icon } from "@iconify/react";
import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Box,
  Button,
  Card,
  Container,
  Dialog,
  IconButton,
  Menu,
  MenuItem,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useSnackbar } from "notistack";
import React, { forwardRef, useState } from "react";
import ListHeader from "../../components/admin/ListHeader";
import QuestionDetail from "../../components/admin/QuestionDetail";
import Page from "../../components/general/Page";
import useQuestionList from "../../hooks/admin/useQuestionList";
import useSetQuestionStatus from "../../hooks/admin/useSetQuestionStatus";
import AdminLayout from "../../layouts/admin";
import { QuestionStatus } from "../../types/QuestionStatus";
import { QuestionStatus as QuestionStatusName } from "../../types/Question";
import { fDateTime } from "../../utils/formatTime";

const LABELS = ["问题标题", "提问者", "回答者", "创建时间"];
const statusArray: QuestionStatus[] = [
  "CENSORING",
  "ACCEPTING",
  "ANSWERING",
  "ANSWERED",
  "CHATTING",
  "FINISHED",
  "FAILED",
  "EDITING",
];
const statusNameArray: QuestionStatusName[] = [
  "待审核",
  "待接单",
  "回答中",
  "已回答",
  "聊天中",
  "订单完成",
  "订单失败",
  "审核不通过",
];

export const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>
  ) => <Slide direction="up" {...props} ref={ref} />
);

export default function QuestionCensor(): JSX.Element {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [questionIdInDialog, setQuestionIdInDialog] = useState("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [status, setStatus] = useState<QuestionStatus>("CENSORING");
  const [menuOpen, setMenuOpen] = useState<null | HTMLElement>(null);
  const [buttonText, setButtonText] = useState<QuestionStatusName>("待审核");

  const [[questions, count], refreshQuestions] = useQuestionList(
    status,
    page,
    pageSize
  );
  const setQuestionStatus = useSetQuestionStatus();

  const handleTableRowClick = (id: string) => {
    setQuestionIdInDialog(id);
    setDialogOpen(true);
  };

  const handleApproveClick = async () => {
    setDialogOpen(false);
    const message = await setQuestionStatus(questionIdInDialog, "ACCEPTING");
    refreshQuestions();
    if (message === null) {
      enqueueSnackbar(`已通过问题 ${questionIdInDialog}`, {
        variant: "success",
        action: key => (
          <IconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </IconButton>
        ),
      });
    } else {
      enqueueSnackbar(message, {
        variant: "error",
        action: key => (
          <IconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </IconButton>
        ),
      });
    }
  };

  const handleRejectClick = async () => {
    setDialogOpen(false);
    const message = await setQuestionStatus(questionIdInDialog, "EDITING");
    refreshQuestions();
    if (message === null) {
      enqueueSnackbar(`已驳回问题 ${questionIdInDialog}`, {
        variant: "success",
        action: key => (
          <IconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </IconButton>
        ),
      });
    } else {
      enqueueSnackbar(message, {
        variant: "error",
        action: key => (
          <IconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </IconButton>
        ),
      });
    }
  };

  const handleChangePageSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number
  ) => {
    setPage(page);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuOpen(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuOpen(null);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    setButtonText(statusNameArray[index]);
    setStatus(statusArray[index]);
    setMenuOpen(null);
  };

  return (
    <AdminLayout>
      <Page title="问题审核">
        <Container>
          <Card sx={{ mt: 12 }}>
            <Button sx={{ margin: 2 }} variant="text" onClick={handleMenuOpen}>
              {buttonText}
            </Button>
            <Menu
              keepMounted
              anchorEl={menuOpen}
              open={Boolean(menuOpen)}
              onClose={handleMenuClose}
            >
              {statusNameArray.map((name, idx) => (
                <MenuItem
                  key={idx}
                  onClick={event => handleMenuItemClick(event, idx)}
                >
                  {name}
                </MenuItem>
              ))}
            </Menu>
            <TableContainer sx={{ maxWidth: 1000 }}>
              <Table>
                <ListHeader labels={LABELS} />
                <TableBody>
                  {questions.map((question, idx) => (
                    <TableRow
                      sx={{ height: 80 }}
                      hover
                      key={idx}
                      tabIndex={-1}
                      role="listitem"
                      onClick={() => handleTableRowClick(question.id)}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        padding="none"
                        style={{ maxWidth: 200 }}
                      >
                        <Box
                          sx={{
                            py: 2,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="subtitle2" noWrap>
                            {question.title}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell style={{ maxWidth: 80 }}>
                        <Typography variant="inherit" noWrap>
                          {question.questioner}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ maxWidth: 80 }}>
                        <Typography variant="inherit" noWrap>
                          {question.respondent}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ maxWidth: 80 }}>
                        <Typography variant="inherit" noWrap>
                          {fDateTime(question.createdAt)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 20]}
              component="div"
              rowsPerPage={pageSize}
              page={page}
              count={count}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangePageSize}
            />
          </Card>
        </Container>
      </Page>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        TransitionComponent={Transition}
        fullScreen
      >
        <AppBar position="relative">
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDialogClose}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flex: 1, ml: 2 }}>
              问题详情
            </Typography>
            {status === "CENSORING" && (
              <Button color="inherit" onClick={handleApproveClick}>
                <Typography variant="h6">通过</Typography>
              </Button>
            )}
            {status === "CENSORING" && (
              <Button color="error" onClick={handleRejectClick}>
                <Typography variant="h6">驳回</Typography>
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <QuestionDetail questionId={questionIdInDialog} />
      </Dialog>
    </AdminLayout>
  );
}
