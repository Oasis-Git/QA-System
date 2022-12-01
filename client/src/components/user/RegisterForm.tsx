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
import useAuth from "../../hooks/user/useAuth";
import { PATH_DASHBOARD, PATH_USER } from "../../routes/paths";

interface InitialValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  afterSubmitMessage?: string;
}

export default function RegisterForm(): JSX.Element {
  const [isPasswordShowed, setIsPasswordShowed] = useState(false);
  const [isConfirmPasswordShowed, setIsConfirmPasswordShowed] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const auth = useAuth();
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setIsPasswordShowed(isPasswordShowed => !isPasswordShowed);
  };

  const handleShowConfirmPassword = () => {
    setIsConfirmPasswordShowed(
      isConfirmPasswordShowed => !isConfirmPasswordShowed
    );
  };

  //set the form schema
  const registerSchema = Yup.object().shape({
    username: Yup.string()
      .required("请填写用户名")
      .max(50, "用户名太长了，应少于50字符")
      .min(2, "用户名太短了，应多于2字符"),
    email: Yup.string().email("请输入正确格式的邮箱").required("请填写邮箱"),
    password: Yup.string().min(6, "密码长度至少为6").required("请填写密码"),
    confirmPassword: Yup.string()
      .required("请再次输入密码以确认")
      .oneOf([Yup.ref("password"), null], "两次密码不匹配"),
  });

  //form configuration
  const formik = useFormik<InitialValues>({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        const message = await auth.register(
          values.username,
          values.email,
          values.password
        );
        if (message !== null) {
          resetForm();
          setSubmitting(false);
          setErrors({
            afterSubmitMessage: message,
          });
        } else {
          enqueueSnackbar("注册成功", {
            variant: "success",
            action: key => (
              <IconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </IconButton>
            ),
          });
          setSubmitting(false);
          navigate(PATH_DASHBOARD.settings.editBasicInfo);
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
            type="email"
            label="邮箱"
            {...formik.getFieldProps("email")}
            error={Boolean(formik.touched.email && formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
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

          <TextField
            fullWidth
            type={isConfirmPasswordShowed ? "text" : "password"}
            label="确认密码"
            {...formik.getFieldProps("confirmPassword")}
            error={Boolean(
              formik.touched.confirmPassword && formik.errors.confirmPassword
            )}
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={handleShowConfirmPassword} edge="end">
                    <Icon
                      icon={isConfirmPasswordShowed ? eyeFill : eyeOffFill}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Typography variant="body2" align="right" sx={{ mt: 3 }}>
            已经有账号了？&nbsp;
            <Link
              variant="subtitle2"
              component={RouterLink}
              to={PATH_USER.login}
            >
              去登录
            </Link>
          </Typography>

          <LoadingButton
            fullWidth
            type="submit"
            size="large"
            variant="contained"
            loading={formik.isSubmitting}
          >
            注册
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
