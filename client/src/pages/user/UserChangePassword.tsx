import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik, Form, FormikProvider } from "formik";
import { Icon } from "@iconify/react";
import closeFill from "@iconify/icons-eva/close-fill";
// material
import {
  Stack,
  Container,
  Card,
  TextField,
  IconButton,
  Alert,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// components
import Page from "../../components/general/Page";
import HeaderBreadcrumbs from "../../components/general/HeaderBreadcrumbs";
import useUserChangePassword from "../../hooks/user/useUserChangePassword";

interface InitialValues {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  afterSubmitMessage?: string;
}

export default function UserChangePassword(): JSX.Element {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const userChangePassword = useUserChangePassword();

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("必须填入原密码"),
    newPassword: Yup.string()
      .min(6, "新密码长度应至少为6位")
      .required("必须填入新密码"),
    confirmNewPassword: Yup.string().oneOf(
      [Yup.ref("newPassword"), null],
      "两次输入必须一致"
    ),
  });

  const formik = useFormik<InitialValues>({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: ChangePassWordSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const message = await userChangePassword(
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
          enqueueSnackbar("密码重新设置成功", {
            variant: "success",
            action: key => (
              <IconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </IconButton>
            ),
          });
          setSubmitting(false);
          resetForm();
        }
      } catch (error) {
        console.log("异常： " + error);
      }
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;
  return (
    <Page title="重置密码">
      <Container maxWidth={"lg"}>
        <HeaderBreadcrumbs
          heading="设置"
          links={[
            { name: "个人中心", href: PATH_DASHBOARD.profile },
            { name: "重置密码" },
          ]}
        />

        <Card sx={{ p: 3 }}>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3} alignItems="flex-end">
                {formik.errors.afterSubmitMessage && (
                  <Alert severity="error">
                    {formik.errors.afterSubmitMessage}
                  </Alert>
                )}

                <TextField
                  {...getFieldProps("oldPassword")}
                  fullWidth
                  autoComplete="on"
                  type="password"
                  label="原密码"
                  error={Boolean(touched.oldPassword && errors.oldPassword)}
                  helperText={touched.oldPassword && errors.oldPassword}
                />

                <TextField
                  {...getFieldProps("newPassword")}
                  fullWidth
                  autoComplete="on"
                  type="password"
                  label="新密码"
                  error={Boolean(touched.newPassword && errors.newPassword)}
                  helperText={
                    (touched.newPassword && errors.newPassword) ||
                    "新密码长度应至少6位"
                  }
                />

                <TextField
                  {...getFieldProps("confirmNewPassword")}
                  fullWidth
                  autoComplete="on"
                  type="password"
                  label="确认新密码"
                  error={Boolean(
                    touched.confirmNewPassword && errors.confirmNewPassword
                  )}
                  helperText={
                    touched.confirmNewPassword && errors.confirmNewPassword
                  }
                />

                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  重置密码
                </LoadingButton>
              </Stack>
            </Form>
          </FormikProvider>
        </Card>
      </Container>
    </Page>
  );
}
