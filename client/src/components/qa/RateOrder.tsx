import { LoadingButton } from "@mui/lab";
import {
  Box,
  FormHelperText,
  Link,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
// material
import { styled } from "@mui/material/styles";
import { Form, FormikProvider, useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import useRateOrder from "../../hooks/qa/useRateOrder";
import { PATH_DASHBOARD } from "../../routes/paths";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadiusMd,
  backgroundColor: theme.palette.background.neutral,
}));

interface RateOrderProps {
  id: string;
}

// ----------------------------------------------------------------------

export default function RateOrder({ id }: RateOrderProps): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const postRating = useRateOrder();
  const navigate = useNavigate();

  const ReviewSchema = Yup.object().shape({
    rating: Yup.mixed().required("Rating is required"),
  });

  const formik = useFormik({
    initialValues: {
      rating: -1,
      review: "",
    },
    validationSchema: ReviewSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const message = await postRating(id, values.rating);
      setSubmitting(false);
      if (message === null) {
        resetForm();
        enqueueSnackbar("提交成功！", { variant: "success" });
        navigate(PATH_DASHBOARD.orders);
      } else {
        enqueueSnackbar(message, { variant: "error" });
      }
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    getFieldProps,
  } = formik;

  return (
    <RootStyle>
      <Typography variant="subtitle1" gutterBottom>
        订单评分
      </Typography>

      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" sx={{ mr: 1.5 }}>
              您对于本次问答服务（订单编号：
              <Link href={`/user/dashboard/orders/${id}/detail`}>{id}</Link>
              ）的评分：
            </Typography>
            <Rating
              {...getFieldProps("rating")}
              onChange={(event, value) =>
                setFieldValue("rating", Number(value))
              }
            />
          </Box>
          {errors.rating && (
            <FormHelperText error>
              {touched.rating && errors.rating}
            </FormHelperText>
          )}

          <TextField
            fullWidth
            multiline
            minRows={3}
            maxRows={5}
            label="如有评论可以在这里写出，我们会反馈给回答者"
            {...getFieldProps("review")}
            error={Boolean(touched.review && errors.review)}
            helperText={touched.review && errors.review}
            sx={{ mt: 3 }}
          />

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              提交评分
            </LoadingButton>
          </Box>
        </Form>
      </FormikProvider>
    </RootStyle>
  );
}
