import closeFill from "@iconify/icons-eva/close-fill";
import { Icon } from "@iconify/react";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Card,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { Form, FormikProvider, useFormik } from "formik";
import { useSnackbar } from "notistack";
import * as Yup from "yup";
import useChangePassword from "../../hooks/admin/useChangePassword";
import AdminLayout from "../../layouts/admin";
import { actions } from "../../redux/slices/adminAuth";
import { useDispatch } from "../../redux/store";
import { PATH_API_ADMIN } from "../../routes/paths";
import { ApiResponse } from "../../types/ApiResponse";

interface InitialValues {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  afterSubmitMessage?: string;
}

export default function ChangePassword(): JSX.Element {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const changePassword = useChangePassword();
  const dispatch = useDispatch();

  const changePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("请输入原密码"),
    newPassword: Yup.string()
      .min(6, "密码长度至少为6")
      .required("请填写新密码"),
    confirmNewPassword: Yup.string()
      .required("请再次输入新密码以确认")
      .oneOf([Yup.ref("newPassword"), null], "两次密码不匹配"),
  });
  const formik = useFormik<InitialValues>({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: changePasswordSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      const message = await changePassword(
        values.oldPassword,
        values.newPassword
      );

      if (message !== null) {
        resetForm();
        setSubmitting(false);
        setErrors({
          afterSubmitMessage: message,
        });
      } else {
        enqueueSnackbar("密码修改成功", {
          variant: "success",
          action: key => (
            <IconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </IconButton>
          ),
        });
        setSubmitting(false);
        resetForm();
        const response = await axios.get(PATH_API_ADMIN.activated);
        const data = response.data as ApiResponse<{ activated: boolean }>;
        dispatch(actions.setActivated({ activated: data.data.activated }));
      }
    },
  });

  return (
    <AdminLayout>
      <Card sx={{ padding: 3, mt: 12, maxWidth: 480, mx: "auto" }}>
        <Typography variant="subtitle1" sx={{ mb: 5 }}>
          修改密码
        </Typography>
        <FormikProvider value={formik}>
          <Form autoComplete="off" onSubmit={formik.handleSubmit} noValidate>
            <Stack spacing={3} direction="column">
              {formik.errors.afterSubmitMessage && (
                <Alert severity="error">
                  {formik.errors.afterSubmitMessage}
                </Alert>
              )}

              <TextField
                {...formik.getFieldProps("oldPassword")}
                fullWidth
                autoComplete="on"
                type="password"
                label="原密码"
                error={Boolean(
                  formik.touched.oldPassword && formik.errors.oldPassword
                )}
                helperText={
                  formik.touched.oldPassword && formik.errors.oldPassword
                }
              />

              <TextField
                {...formik.getFieldProps("newPassword")}
                fullWidth
                autoComplete="on"
                type="password"
                label="新密码"
                error={Boolean(
                  formik.touched.newPassword && formik.errors.newPassword
                )}
                helperText={
                  formik.touched.newPassword && formik.errors.newPassword
                }
              />

              <TextField
                {...formik.getFieldProps("confirmNewPassword")}
                fullWidth
                autoComplete="on"
                type="password"
                label="确认新密码"
                error={Boolean(
                  formik.touched.confirmNewPassword &&
                    formik.errors.confirmNewPassword
                )}
                helperText={
                  formik.touched.confirmNewPassword &&
                  formik.errors.confirmNewPassword
                }
              />

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={formik.isSubmitting}
              >
                修改密码
              </LoadingButton>
            </Stack>
          </Form>
        </FormikProvider>
      </Card>
    </AdminLayout>
  );
}
