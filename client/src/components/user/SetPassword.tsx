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
import { Form, FormikProvider, useFormik } from "formik";
import { useSnackbar } from "notistack";
import * as Yup from "yup";
import useResetPassword from "../../hooks/user/useResetPassword";

interface InitialValues {
  password: string;
  confirmPassword: string;
  afterSubmitMessage?: string;
}

interface SetPasswordProps {
  goToNextStep: () => void;
  currentUsername: string;
}

export default function SetPassword({
  goToNextStep,
  currentUsername,
}: SetPasswordProps): JSX.Element {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const resetPassword = useResetPassword();

  const setPasswordSchema = Yup.object().shape({
    password: Yup.string().min(6, "密码长度至少为6").required("请填写密码"),
    confirmPassword: Yup.string()
      .required("请再次输入密码以确认")
      .oneOf([Yup.ref("password"), null], "两次密码不匹配"),
  });

  const formik = useFormik<InitialValues>({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: setPasswordSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        const message = await resetPassword(currentUsername, values.password);
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
          goToNextStep();
        }
      } catch (error) {
        console.log("异常： " + error);
      }
    },
  });

  return (
    <Card sx={{ padding: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 5 }}>
        {currentUsername}，请重新设置密码
      </Typography>
      <FormikProvider value={formik}>
        <Form autoComplete="off" onSubmit={formik.handleSubmit} noValidate>
          <Stack spacing={3} direction="column">
            {formik.errors.afterSubmitMessage && (
              <Alert severity="error">{formik.errors.afterSubmitMessage}</Alert>
            )}

            <TextField
              {...formik.getFieldProps("password")}
              fullWidth
              autoComplete="on"
              type="password"
              label="密码"
              error={Boolean(formik.touched.password && formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />

            <TextField
              {...formik.getFieldProps("confirmPassword")}
              fullWidth
              autoComplete="on"
              type="password"
              label="确认密码"
              error={Boolean(
                formik.touched.confirmPassword && formik.errors.confirmPassword
              )}
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
            />

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={formik.isSubmitting}
            >
              重置密码
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </Card>
  );
}
