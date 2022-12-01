import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
// material
import { styled } from "@mui/material/styles";
import { Form, FormikProvider, useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { NavLink as RouterLink, useParams } from "react-router-dom";
import * as Yup from "yup";
import usePostQuestion from "../../hooks/qa/usePostQuestion";
import useLocalStorage from "../../hooks/useLocalStorage";
import MarkdownEditor from "../general/editor/MarkdownEditor";

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

interface NewQuestionProps {
  goToNextStep: () => void;
}

type Storage = {
  title: string;
  description: string;
  isPublic: boolean;
};
const INITIAL_STORAGE: Storage = {
  title: "",
  description: "",
  isPublic: false,
};

export default function NewQuestionForm({
  goToNextStep,
}: NewQuestionProps): JSX.Element {
  const [storage, setStorage] = useLocalStorage(
    "new-question",
    INITIAL_STORAGE
  );

  const { enqueueSnackbar } = useSnackbar();
  const [description, setDescription] = useState(storage.description);
  const { name: respondent = "" } = useParams();
  const postQuestion = usePostQuestion();

  const NewQuestionSchema = Yup.object().shape({
    title: Yup.string().required("必须填写标题"),
    description: Yup.string(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: storage.title,
      description: "",
      images: [],
      isPublic: storage.isPublic,
    },
    validationSchema: NewQuestionSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      setSubmitting(true);
      const message = await postQuestion({
        title: values.title,
        respondent,
        description,
        isPublic: values.isPublic,
      });
      setSubmitting(false);
      if (typeof message !== "string") {
        setDescription("");
        resetForm();
        setStorage(INITIAL_STORAGE);
        enqueueSnackbar("订单创建成功", {
          variant: "success",
        });
        goToNextStep();
      } else {
        enqueueSnackbar(message, {
          variant: "error",
        });
      }
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} sx={{ zIndex: 1 }}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="问题标题"
                  {...getFieldProps("title")}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                />

                <div>
                  <LabelStyle>问题描述</LabelStyle>
                  {/*<QuillEditor*/}
                  {/*  id="simple-editor"*/}
                  {/*  value={description}*/}
                  {/*  onChange={value => setDescription(value)}*/}
                  {/*/>*/}
                  <MarkdownEditor
                    height={500}
                    value={description}
                    onChange={setDescription}
                  />
                </div>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <FormControlLabel
                  control={<Switch {...getFieldProps("isPublic")} />}
                  label="公开提问"
                  sx={{ mt: 2 }}
                />
              </Card>

              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                loading={isSubmitting}
              >
                {"向TA提问"}
              </LoadingButton>

              <Button
                fullWidth
                variant="contained"
                size="large"
                color="error"
                component={RouterLink}
                to={"/"}
              >
                {"放弃提问"}
              </Button>

              <Button
                onClick={() => {
                  setStorage({
                    title: formik.values.title,
                    description,
                    isPublic: formik.values.isPublic,
                  });
                }}
                fullWidth
                variant="contained"
                size="large"
                color="warning"
              >
                {"暂存问题"}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
