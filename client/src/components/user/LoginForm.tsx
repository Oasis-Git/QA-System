import closeFill from "@iconify/icons-eva/close-fill";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import { Icon } from "@iconify/react";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ContextType as AdminAuthContextType } from "../../contexts/admin/AuthContext";
import { ContextType as UserAuthContextType } from "../../contexts/user/AuthContext";
import { PATH_ADMIN, PATH_DASHBOARD, PATH_USER } from "../../routes/paths";

interface InitialValues {
  username: string;
  password: string;
  afterSubmitMessage?: string;
}

interface LoginFormProps {
  auth: UserAuthContextType | AdminAuthContextType;
  isAdmin: boolean;
}

export default function LoginForm({
  auth,
  isAdmin,
}: LoginFormProps): JSX.Element {
  const [isPasswordShowed, setIsPasswordShowed] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setIsPasswordShowed(isPasswordShowed => !isPasswordShowed);
  };

  //set the form schema
  const LoginSchema = Yup.object().shape({
    username: Yup.string().required("请填写用户名"),
    password: Yup.string().min(6, "密码长度至少为6").required("请填写密码"),
  });

  //form configuration
  const formik = useFormik<InitialValues>({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        const message = await auth.login(values.username, values.password);
        if (message !== null) {
          resetForm();
          setSubmitting(false);
          setErrors({
            afterSubmitMessage: message,
          });
        } else {
          enqueueSnackbar("登录成功", {
            variant: "success",
            action: key => (
              <IconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </IconButton>
            ),
          });
          setSubmitting(false);
          navigate(isAdmin ? PATH_ADMIN.questions : PATH_DASHBOARD.profile);
        }
      } catch (error) {
        console.log("异常： " + error);
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" onSubmit={formik.handleSubmit} noValidate>
        <Stack spacing={3} direction="column">
          {formik.errors.afterSubmitMessage && (
            <Alert severity="error">{formik.errors.afterSubmitMessage}</Alert>
          )}

          <TextField
            fullWidth
            type="text"
            label="用户名"
            {...formik.getFieldProps("username")}
            error={Boolean(formik.touched.username && formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />

          <TextField
            fullWidth
            type={isPasswordShowed ? "text" : "password"}
            label="密码"
            {...formik.getFieldProps("password")}
            error={Boolean(formik.touched.password && formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={isPasswordShowed ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {!isAdmin && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ my: 2 }}
            >
              <Typography variant="body2">
                没有账号？&nbsp;
                <Link
                  variant="subtitle2"
                  component={RouterLink}
                  to={PATH_USER.register}
                >
                  去注册
                </Link>
              </Typography>

              <Link
                component={RouterLink}
                variant="subtitle2"
                to={PATH_USER.resetPassword}
              >
                忘记密码？
              </Link>
            </Stack>
          )}

          <LoadingButton
            fullWidth
            type="submit"
            size="large"
            variant="contained"
            loading={formik.isSubmitting}
          >
            登录
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
