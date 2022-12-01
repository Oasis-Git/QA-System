import { LoadingButton } from "@mui/lab";
import { Box, Card, Container, Grid, Stack, TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import HeaderBreadcrumbs from "../../components/general/HeaderBreadcrumbs";
// components
import Page from "../../components/general/Page";
import useUpdateRespondentProfile from "../../hooks/user/useUpdateRespondentProfile";
import { PATH_DASHBOARD } from "../../routes/paths";

export default function RespondentInfo(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const ChangeInfoSchema = Yup.object().shape({
    fee: Yup.number().required("收取费用必填"),
    specialty1: Yup.string().required("专业经历至少填写一条"),
    about: Yup.string().required("个人简介必填"),
    detail: Yup.string().required("个人详情必填"),
  });
  const [profile, updateProfile] = useUpdateRespondentProfile();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      specialty1:
        profile.specialities.length > 0 ? profile.specialities[0] : "",
      specialty2:
        profile.specialities.length > 1 ? profile.specialities[1] : "",
      specialty3:
        profile.specialities.length > 2 ? profile.specialities[2] : "",
      ...profile,
    },
    validationSchema: ChangeInfoSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      const message = await updateProfile({
        fee: values.fee,
        specialities: [values.specialty1, values.specialty2, values.specialty3],
        about: values.about,
        detail: values.detail,
      });
      setSubmitting(false);
      if (message === null) {
        enqueueSnackbar("提交成功！", {
          variant: "success",
        });
        navigate(PATH_DASHBOARD.profile);
      } else {
        enqueueSnackbar(message, {
          variant: "error",
        });
      }
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Page title="修改回答者信息">
      <Container maxWidth={"lg"}>
        <HeaderBreadcrumbs
          heading="设置"
          links={[
            { name: "个人中心", href: PATH_DASHBOARD.profile },
            { name: "修改回答者相关信息" },
          ]}
        />
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={{ xs: 3, sm: 2 }}
                    >
                      <TextField
                        fullWidth
                        label="收费"
                        {...getFieldProps("fee")}
                        error={Boolean(touched.fee && errors.fee)}
                        helperText={touched.fee && errors.fee}
                      />
                      <TextField
                        fullWidth
                        label="专业经历1"
                        {...getFieldProps("specialty1")}
                        error={Boolean(touched.specialty1 && errors.specialty1)}
                        helperText={touched.specialty1 && errors.specialty1}
                      />
                    </Stack>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={{ xs: 3, sm: 2 }}
                    >
                      <TextField
                        fullWidth
                        label="专业经历2"
                        {...getFieldProps("specialty2")}
                        error={Boolean(touched.specialty2 && errors.specialty2)}
                        helperText={touched.specialty2 && errors.specialty2}
                      />
                      <TextField
                        fullWidth
                        label="专业经历3"
                        {...getFieldProps("specialty3")}
                        error={Boolean(touched.specialty3 && errors.specialty3)}
                        helperText={touched.specialty3 && errors.specialty3}
                      />
                    </Stack>

                    <TextField
                      {...getFieldProps("about")}
                      fullWidth
                      multiline
                      minRows={2}
                      maxRows={2}
                      label="简介"
                      error={Boolean(touched.about && errors.about)}
                      helperText={touched.about && errors.about}
                    />

                    <TextField
                      {...getFieldProps("detail")}
                      fullWidth
                      multiline
                      minRows={4}
                      maxRows={4}
                      label="详情"
                      error={Boolean(touched.detail && errors.detail)}
                      helperText={touched.detail && errors.detail}
                    />

                    <Box
                      sx={{
                        mt: 3,
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                      >
                        {"提交修改"}
                      </LoadingButton>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
