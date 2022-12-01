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
import useValidateResetPasswordEmail from "../../hooks/user/useValidateResetPasswordEmail";

interface InitialValues {
  email: string;
  afterSubmitMessage?: string;
}

interface CheckEmailProps {
  goToNextStep: () => void;
  setCurrentUsername: (username: string) => void;
}

export default function CheckEmail({
  goToNextStep,
  setCurrentUsername,
}: CheckEmailProps): JSX.Element {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const validateResetPasswordEmail = useValidateResetPasswordEmail();

  const checkEmailSchema = Yup.object().shape({
    email: Yup.string().email("请输入正确格式的邮箱").required("请填写邮箱"),
  });

  const formik = useFormik<InitialValues>({
    initialValues: {
      email: "",
    },
    validationSchema: checkEmailSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        const message = await validateResetPasswordEmail(values.email);

        if (typeof message === "string") {
          resetForm();
          setSubmitting(false);
          setErrors({
            afterSubmitMessage: message,
          });
        } else {
          const username = message.username;

          enqueueSnackbar("邮箱验证成功", {
            variant: "success",
            action: key => (
              <IconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </IconButton>
            ),
          });
          setSubmitting(false);
          setCurrentUsername(username);
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
        请输入邮箱完成身份验证
      </Typography>
      <FormikProvider value={formik}>
        <Form autoComplete="off" onSubmit={formik.handleSubmit} noValidate>
          <Stack spacing={3} direction="column">
            {formik.errors.afterSubmitMessage && (
              <Alert severity="error">{formik.errors.afterSubmitMessage}</Alert>
            )}

            <TextField
              fullWidth
              {...formik.getFieldProps("email")}
              type="email"
              label="邮箱"
              error={Boolean(formik.touched.email && formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={formik.isSubmitting}
            >
              验证邮箱
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </Card>
  );
}
