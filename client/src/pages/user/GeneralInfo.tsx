import { LoadingButton } from "@mui/lab";
// material
import {
  Box,
  Card,
  Container,
  FormHelperText,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useCallback } from "react";
import HeaderBreadcrumbs from "../../components/general/HeaderBreadcrumbs";
// components
import Page from "../../components/general/Page";
import UploadAvatar from "../../components/general/upload/UploadAvatar";
import useFileUpload from "../../hooks/useFileUpload";
import useGeneralInfo from "../../hooks/user/useGeneralInfo";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// utils
import { fData } from "../../utils/formatNumber";

export default function GeneralInfo(): JSX.Element {
  const [profile, updateProfile] = useGeneralInfo();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: profile,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      console.log(JSON.stringify(values));
      const message = await updateProfile(values);
      setSubmitting(false);
      if (message === null) {
        resetForm();
        enqueueSnackbar("提交成功！", { variant: "success" });
      } else {
        enqueueSnackbar(message, { variant: "error" });
      }
    },
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setFieldValue,
  } = formik;

  const uploadFile = useFileUpload();

  const handleDrop = useCallback(
    async acceptedFiles => {
      const file = acceptedFiles[0];
      const response = await uploadFile(file);
      if (typeof response === "string") {
        enqueueSnackbar(response, { variant: "error" });
      } else {
        const { url } = response[0];
        if (url === undefined) {
          enqueueSnackbar("上传失败！", { variant: "error" });
        } else {
          await setFieldValue("avatar", url);
        }
      }
    },
    [uploadFile, enqueueSnackbar, setFieldValue]
  );

  return (
    <Page title="修改个人信息">
      <Container maxWidth={"lg"}>
        <HeaderBreadcrumbs
          heading="设置"
          links={[
            { name: "个人中心", href: PATH_DASHBOARD.profile },
            { name: "修改个人信息" },
          ]}
        />
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={2} md={1} />
              <Grid item xs={10} md={4}>
                <Card sx={{ py: 10, px: 3, textAlign: "center" }}>
                  <UploadAvatar
                    accept="image/*"
                    file={values.avatar}
                    maxSize={3145728}
                    onDrop={handleDrop}
                    error={Boolean(touched.avatar && errors.avatar)}
                    caption={
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 2,
                          mx: "auto",
                          display: "block",
                          textAlign: "center",
                          color: "text.secondary",
                        }}
                      >
                        允许 *.jpeg, *.jpg, *.png, *.gif 格式
                        <br /> 最大 {fData(3145728)}
                      </Typography>
                    }
                  />

                  <FormHelperText error sx={{ px: 2, textAlign: "center" }}>
                    {touched.avatar && errors.avatar}
                  </FormHelperText>
                </Card>
              </Grid>

              <Grid item xs={12} md={7}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={{ xs: 2, md: 3 }}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                      <TextField
                        fullWidth
                        label="微信"
                        {...getFieldProps("wechat")}
                      />
                      <TextField
                        fullWidth
                        label="微博"
                        {...getFieldProps("weibo")}
                      />
                    </Stack>

                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                      <TextField
                        fullWidth
                        label="现居地"
                        {...getFieldProps("location")}
                      />
                    </Stack>
                  </Stack>

                  <Box
                    sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                  >
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                    >
                      提交修改
                    </LoadingButton>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
