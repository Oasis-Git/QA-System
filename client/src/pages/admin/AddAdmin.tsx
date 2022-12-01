import closeFill from "@iconify/icons-eva/close-fill";
import plusFill from "@iconify/icons-eva/plus-fill";
import fileDownload from "@iconify/icons-ic/file-download";
import fileUpload from "@iconify/icons-ic/file-upload";
import help from "@iconify/icons-ic/help";
import { Icon } from "@iconify/react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { concat } from "lodash";
import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import * as Yup from "yup";
import ListHeader from "../../components/admin/ListHeader";
import Page from "../../components/general/Page";
import useAddAdmin from "../../hooks/admin/useAddAdmin";
import AdminLayout from "../../layouts/admin";

interface InitialValues {
  username: string;
}

export default function AddAdmin(): JSX.Element {
  const [adminList, setAdminList] = useState<
    {
      username: string;
      password?: string;
    }[]
  >([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addAble, setAddAble] = useState(true);
  const addAdmin = useAddAdmin();

  const instruction = `添加管理员方法：

1. 点击 “添加” 按钮，输入管理员昵称，添加单个管理员。

2. 使用本地 JSON 文件批量添加。JSON 格式为字符串数组，数组中每一个字符串代表一个管理员的昵称。例如：

  \`\`\`json
  ["Alice", "Bob", "张三"]
  \`\`\`

  请上传符合上述格式的 JSON 文件。

点击提交按钮即可添加列表中的所有管理员，请求成功后可以拿到每个管理员的初始密码，点击导出 JSON 可得到对应包含对应列表的文件。

`;

  const adminUsernameSchema = Yup.object().shape({
    username: Yup.string()
      .required("请输入新管理员的昵称")
      .min(2, "昵称长度至少为2")
      .max(50, "昵称长度最大为50"),
  });

  const formik = useFormik<InitialValues>({
    initialValues: {
      username: "",
    },
    validationSchema: adminUsernameSchema,
    onSubmit: async (values, { resetForm }) => {
      setAdminList(adminList => {
        return concat(adminList, values);
      });
      setDialogOpen(false);
      resetForm();
    },
  });

  const handleDrop = useCallback(
    (acceptedFile: File[]) => {
      try {
        const file = acceptedFile[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async () => {
          try {
            const fileAdminList = JSON.parse(reader.result as string);
            if (
              !(fileAdminList instanceof Array) ||
              fileAdminList.some(element => typeof element !== "string")
            ) {
              enqueueSnackbar(
                "JSON 文件格式错误，请上传一个包含新管理员用户名的数组",
                {
                  variant: "error",
                  action: key => (
                    <IconButton size="small" onClick={() => closeSnackbar(key)}>
                      <Icon icon={closeFill} />
                    </IconButton>
                  ),
                }
              );
              return;
            }
            for (const username of fileAdminList) {
              if (!(await adminUsernameSchema.isValid({ username }))) {
                enqueueSnackbar(`用户名 \`${username}\` 不符合要求`, {
                  variant: "error",
                  action: key => (
                    <IconButton size="small" onClick={() => closeSnackbar(key)}>
                      <Icon icon={closeFill} />
                    </IconButton>
                  ),
                });
                return;
              }
            }
            setAdminList(adminList =>
              concat(
                adminList,
                fileAdminList.map(username => ({ username }))
              )
            );
          } catch (error) {
            enqueueSnackbar("文件格式错误，请上传 JSON 格式的文件", {
              variant: "error",
              action: key => (
                <IconButton size="small" onClick={() => closeSnackbar(key)}>
                  <Icon icon={closeFill} />
                </IconButton>
              ),
            });
          }
        };
      } catch (error) {
        enqueueSnackbar("文件加载异常，请重试", {
          variant: "error",
          action: key => (
            <IconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </IconButton>
          ),
        });
      }
    },
    [adminUsernameSchema, closeSnackbar, enqueueSnackbar]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
  });

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    const message = await addAdmin(adminList.map(({ username }) => username));
    if (typeof message === "string") {
      enqueueSnackbar(message, { variant: "error" });
    } else {
      setAdminList(message);
      setAddAble(false);
    }
  };

  return (
    <AdminLayout>
      <Page title="添加管理员">
        <Container sx={{ mt: 12 }}>
          <Card sx={{ padding: 2 }}>
            {addAble ? (
              <Stack
                sx={{ display: "flex", justifyContent: "start" }}
                direction="row"
              >
                <Button
                  variant="contained"
                  startIcon={<Icon icon={plusFill} />}
                  sx={{ margin: 2 }}
                  onClick={handleDialogOpen}
                >
                  添加
                </Button>

                <Box {...getRootProps()} sx={{ margin: 2 }}>
                  <input {...getInputProps()} />
                  <Button variant="text" startIcon={<Icon icon={fileUpload} />}>
                    导入 JSON
                  </Button>
                </Box>

                <Tooltip
                  title={
                    <Box sx={{ marginLeft: 2 }}>
                      <ReactMarkdown>{instruction}</ReactMarkdown>
                    </Box>
                  }
                >
                  <Icon icon={help} />
                </Tooltip>
              </Stack>
            ) : (
              <Stack
                sx={{ display: "flex", justifyContent: "start" }}
                direction="row"
              >
                <Box {...getRootProps()} sx={{ margin: 2 }}>
                  <Button
                    ref={current => {
                      if (current !== null) {
                        current.download = "admins.json";
                      }
                    }}
                    variant="text"
                    startIcon={<Icon icon={fileDownload} />}
                    href={URL.createObjectURL(
                      new Blob(
                        [
                          JSON.stringify(
                            adminList.filter(
                              ({ password }) => password !== undefined
                            )
                          ),
                        ],
                        { type: "application/octet-stream; charset=tf-8" }
                      )
                    )}
                  >
                    导出 JSON
                  </Button>
                </Box>

                <Tooltip title={<ReactMarkdown>{instruction}</ReactMarkdown>}>
                  <Icon icon={help} />
                </Tooltip>
              </Stack>
            )}

            {adminList.length > 0 && (
              <TableContainer>
                <ListHeader labels={["管理员", "密码"]} />
                <TableBody>
                  {adminList.map(({ username, password }, idx) => (
                    <TableRow
                      sx={{ height: 80 }}
                      hover
                      key={idx}
                      tabIndex={-1}
                      role="listitem"
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        padding="none"
                        style={{ width: 400 }}
                      >
                        <Stack spacing={2} alignItems="center" direction="row">
                          <Avatar alt={"admin"} />
                          <Typography variant="subtitle2" noWrap>
                            {username}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell style={{ width: 700 }}>
                        <Typography variant="body2" noWrap>
                          {addAble
                            ? "提交后查看密码"
                            : password === undefined
                            ? "该用户已是管理员，无法重复添加"
                            : password}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableContainer>
            )}

            {adminList.length > 0 && addAble && (
              <Box sx={{ display: "flex", justifyContent: "end", margin: 2 }}>
                <Button variant="contained" onClick={handleSubmit}>
                  提交
                </Button>
              </Box>
            )}
          </Card>
        </Container>
      </Page>

      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth>
        <DialogTitle>添加管理员</DialogTitle>
        <FormikProvider value={formik}>
          <Form>
            <DialogContent>
              <DialogContentText>请输入新管理员的昵称</DialogContentText>
              <TextField
                autoFocus
                fullWidth
                type="text"
                margin="dense"
                variant="outlined"
                label="管理员昵称"
                {...formik.getFieldProps("username")}
                error={Boolean(
                  formik.touched.username && formik.errors.username
                )}
                helperText={formik.touched.username && formik.errors.username}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="inherit">
                取消
              </Button>
              <Button type="submit" variant="contained">
                确认
              </Button>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </AdminLayout>
  );
}
