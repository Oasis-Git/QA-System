import { LoadingButton } from "@mui/lab";
import { Card, FormHelperText, Grid, Stack, Typography } from "@mui/material";
// material
import { styled } from "@mui/material/styles";
import { Form, FormikProvider, useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Markdown from "../../components/general/Markdown";
import useAnswerQuestion from "../../hooks/qa/useAnswerQuestion";
import { PATH_DASHBOARD } from "../../routes/paths";
import MarkdownEditor from "../general/editor/MarkdownEditor";

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

type AnswerQuestionProps = {
  questionID: string;
  title: string;
  description: string;
};

export default function AnswerQuestionForm({
  questionID,
  title,
  description,
}: AnswerQuestionProps): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const [answer, setAnswer] = useState("");
  const answerQuestion = useAnswerQuestion();
  const navigate = useNavigate();

  const AnswerQuestionSchema = Yup.object().shape({
    content: Yup.string(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      content: "",
      images: [],
    },
    validationSchema: AnswerQuestionSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      setSubmitting(true);
      const message = await answerQuestion(questionID, answer);
      setSubmitting(false);
      if (message === null) {
        setAnswer("");
        resetForm();
        enqueueSnackbar("回答成功", {
          variant: "success",
        });
        navigate(PATH_DASHBOARD.questions);
      } else {
        enqueueSnackbar(message, {
          variant: "error",
        });
      }
    },
  });

  const { errors, touched, handleSubmit, isSubmitting } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Typography variant="h3" gutterBottom>
                  {title}
                </Typography>

                <div>
                  <LabelStyle>问题描述</LabelStyle>
                  <Markdown>{description}</Markdown>
                </div>

                <div>
                  <LabelStyle>我的回答</LabelStyle>
                  <MarkdownEditor
                    height={500}
                    value={answer}
                    onChange={setAnswer}
                  />
                  {touched.content && errors.content && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {touched.content && errors.content}
                    </FormHelperText>
                  )}
                </div>

                <LoadingButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                >
                  {"提交答案"}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
