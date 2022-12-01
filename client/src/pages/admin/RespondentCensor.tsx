import closeFill from "@iconify/icons-eva/close-fill";
import { Icon } from "@iconify/react";
import {
  Avatar,
  Card,
  Container,
  Dialog,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import ListHeader from "../../components/admin/ListHeader";
import RespondentDetail from "../../components/admin/RespondentDetail";
import Page from "../../components/general/Page";
import useCensorRespondent from "../../hooks/admin/useCensorRespondent";
import useRespondentList from "../../hooks/admin/useRespondentList";
import AdminLayout from "../../layouts/admin";
import { fDateTime } from "../../utils/formatTime";
import { Transition } from "./QuestionCensor";

const LABELS = ["回答者", "个人描述", "咨询费", "申请时间"];

export default function RespondentCensor(): JSX.Element {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userInDialog, setUserInDialog] = useState("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [[respondents, count], refreshRespondentList] = useRespondentList(
    page,
    pageSize
  );
  const censorRespondent = useCensorRespondent();

  const handleRowClick = (username: string) => {
    setUserInDialog(username);
    setDialogOpen(true);
  };

  const handleApproveClick = async () => {
    setDialogOpen(false);
    const message = await censorRespondent(userInDialog, true);
    refreshRespondentList();
    if (message === null) {
      enqueueSnackbar(`已同意 ${userInDialog} 成为回答者`, {
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
    const message = await censorRespondent(userInDialog, false);
    refreshRespondentList();
    if (message === null) {
      enqueueSnackbar(`已驳回 ${userInDialog} 的回答者申请`, {
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

  return (
    <AdminLayout>
      <Page title="回答者审核">
        <Container>
          <Card sx={{ mt: 12 }}>
            <TableContainer sx={{ maxWidth: 1000 }}>
              <Table>
                <ListHeader labels={LABELS} />
                <TableBody>
                  {respondents.map((respondent, idx) => (
                    <TableRow
                      sx={{ height: 80 }}
                      hover
                      key={idx}
                      tabIndex={-1}
                      role="listitem"
                      onClick={() => handleRowClick(respondent.username)}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        padding="none"
                        style={{ maxWidth: 120 }}
                      >
                        <Stack spacing={2} alignItems="center" direction="row">
                          <Avatar
                            alt={respondent.username}
                            src={respondent.avatar}
                          />
                          <Typography variant="subtitle2" noWrap>
                            {respondent.username}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell style={{ maxWidth: 200 }}>
                        <Typography variant="inherit" noWrap>
                          {respondent.description}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ maxWidth: 80 }}>
                        <Typography variant="inherit" noWrap>
                          {`￥${respondent.fee}`}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ maxWidth: 80 }}>
                        <Typography variant="inherit" noWrap>
                          {fDateTime(respondent.updatedAt)}
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
      >
        <RespondentDetail
          username={userInDialog}
          handleApproveClick={handleApproveClick}
          handleRejectClick={handleRejectClick}
        />
      </Dialog>
    </AdminLayout>
  );
}
