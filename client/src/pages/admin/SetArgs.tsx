import {
  Alert,
  Card,
  Container,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Page from "../../components/general/Page";
import AdminLayout from "../../layouts/admin";
import * as Yup from "yup";
import { isInteger } from "lodash";
import { Form, FormikProvider, useFormik } from "formik";
import { useSnackbar } from "notistack";
import help from "@iconify/icons-ic/help";
import { Icon } from "@iconify/react";
import { LoadingButton } from "@mui/lab";
import moment from "moment";
import { Args as ArgType } from "../../types/admin/Args";
import useUpdateArgs from "../../hooks/admin/useUpdateArgs";

interface Args {
  beforeAcceptHour: number;
  beforeAcceptMinute: number;
  acceptToAnswerHour: number;
  acceptToAnswerMinute: number;
  answerToChatHour: number;
  answerToChatMinute: number;
  chatHour: number;
  chatMinute: number;
  fee: number;
  afterSubmitMessage?: string;
}

export default function SetArgs(): JSX.Element {
  const [args, updateArgs] = useUpdateArgs();
  const { enqueueSnackbar } = useSnackbar();

  const minuteSchema = Yup.number()
    .min(0, "分钟数不能小于0")
    .max(59, "分钟数不能大于59")
    .required("必须填写分钟数");
  const hourSchema = Yup.number()
    .min(0, "小时数不能小于0")
    .required("必须填写小时数")
    .test("integer", "小时数必须是整数", (value: number | undefined) => {
      return value !== undefined && isInteger(value);
    });
  const setArgsSchema = Yup.object().shape({
    beforeAcceptHour: hourSchema,
    beforeAcceptMinute: minuteSchema,
    acceptToAnswerHour: hourSchema,
    acceptToAnswerMinute: minuteSchema,
    answerToChatHour: hourSchema,
    answerToChatMinute: minuteSchema,
    chatHour: hourSchema,
    chatMinute: minuteSchema,
    fee: Yup.number().min(0, "收费不能是负数").required("必须填写最高收费"),
  });

  const formik = useFormik<Args>({
    enableReinitialize: true,
    initialValues: {
      beforeAcceptHour: moment.duration(args.timeout.beforeAccept).hours(),
      beforeAcceptMinute: moment.duration(args.timeout.beforeAccept).minutes(),
      acceptToAnswerHour: moment.duration(args.timeout.acceptToAnswer).hours(),
      acceptToAnswerMinute: moment
        .duration(args.timeout.acceptToAnswer)
        .minutes(),
      answerToChatHour: moment.duration(args.timeout.answerToChat).hours(),
      answerToChatMinute: moment.duration(args.timeout.answerToChat).minutes(),
      chatHour: moment.duration(args.timeout.chat).hours(),
      chatMinute: moment.duration(args.timeout.chat).minutes(),
      fee: args.fee,
    },
    validationSchema: setArgsSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      const request: ArgType = {
        timeout: {
          beforeAccept: moment.duration(
            values.beforeAcceptHour * 60 + values.beforeAcceptMinute,
            "minutes"
          ),
          acceptToAnswer: moment.duration(
            values.acceptToAnswerHour * 60 + values.acceptToAnswerMinute,
            "minutes"
          ),
          answerToChat: moment.duration(
            values.answerToChatHour * 60 + values.answerToChatMinute,
            "minutes"
          ),
          chat: moment.duration(
            values.chatHour * 60 + values.chatMinute,
            "minutes"
          ),
        },
        fee: values.fee,
      };
      const message = await updateArgs(request);
      if (message === null) {
        setSubmitting(false);
        enqueueSnackbar("参数修改成功", {
          variant: "success",
        });
      } else {
        setSubmitting(false);
        setErrors({
          afterSubmitMessage: message,
        });
      }
    },
  });

  return (
    <AdminLayout>
      <Page title="系统参数">
        <Container sx={{ mt: 12 }}>
          <Card sx={{ padding: 3, mt: 12, maxWidth: 480, mx: "auto" }}>
            <Typography variant="subtitle1" sx={{ mb: 5 }}>
              修改系统参数
            </Typography>

            <FormikProvider value={formik}>
              <Form
                autoComplete="off"
                onSubmit={formik.handleSubmit}
                noValidate
              >
                <Stack spacing={3} direction="column">
                  {formik.errors.afterSubmitMessage && (
                    <Alert severity="error">
                      {formik.errors.afterSubmitMessage}
                    </Alert>
                  )}

                  <Stack direction="row" spacing={2}>
                    <Stack direction="row">
                      <Typography variant="button">接单时间</Typography>

                      <Tooltip title={"回答者接单的最长时间"}>
                        <Icon icon={help} width={12} height={12} />
                      </Tooltip>
                    </Stack>

                    <TextField
                      type="number"
                      variant="standard"
                      {...formik.getFieldProps("beforeAcceptHour")}
                      inputProps={{ min: 0 }}
                      error={Boolean(
                        formik.touched.beforeAcceptHour &&
                          formik.errors.beforeAcceptHour
                      )}
                      helperText={
                        formik.touched.beforeAcceptHour &&
                        formik.errors.beforeAcceptHour
                      }
                      sx={{ width: 100 }}
                    />

                    <Typography variant="body2">时</Typography>

                    <TextField
                      type="number"
                      variant="standard"
                      {...formik.getFieldProps("beforeAcceptMinute")}
                      inputProps={{ min: 0, max: 59, step: 1 }}
                      error={Boolean(
                        formik.touched.beforeAcceptMinute &&
                          formik.errors.beforeAcceptMinute
                      )}
                      helperText={
                        formik.touched.beforeAcceptMinute &&
                        formik.errors.beforeAcceptMinute
                      }
                      sx={{ width: 100 }}
                    />

                    <Typography variant="body2">分</Typography>
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <Stack direction="row">
                      <Typography variant="button">回答时间</Typography>

                      <Tooltip title={"回答者首次回答的最长时间"}>
                        <Icon icon={help} width={12} height={12} />
                      </Tooltip>
                    </Stack>

                    <TextField
                      type="number"
                      variant="standard"
                      {...formik.getFieldProps("acceptToAnswerHour")}
                      inputProps={{ min: 0 }}
                      error={Boolean(
                        formik.touched.acceptToAnswerHour &&
                          formik.errors.acceptToAnswerHour
                      )}
                      helperText={
                        formik.touched.acceptToAnswerHour &&
                        formik.errors.acceptToAnswerHour
                      }
                      sx={{ width: 100 }}
                    />

                    <Typography variant="body2">时</Typography>

                    <TextField
                      type="number"
                      variant="standard"
                      {...formik.getFieldProps("acceptToAnswerMinute")}
                      inputProps={{ min: 0, max: 59, step: 1 }}
                      error={Boolean(
                        formik.touched.acceptToAnswerMinute &&
                          formik.errors.acceptToAnswerMinute
                      )}
                      helperText={
                        formik.touched.acceptToAnswerMinute &&
                        formik.errors.acceptToAnswerMinute
                      }
                      sx={{ width: 100 }}
                    />

                    <Typography variant="body2">分</Typography>
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <Stack direction="row">
                      <Typography variant="button">浏览时间</Typography>

                      <Tooltip
                        title={
                          "用户浏览回答者给出的首次回答，决定是否继续聊天咨询的最长时间"
                        }
                      >
                        <Icon icon={help} width={12} height={12} />
                      </Tooltip>
                    </Stack>

                    <TextField
                      type="number"
                      variant="standard"
                      {...formik.getFieldProps("answerToChatHour")}
                      inputProps={{ min: 0 }}
                      error={Boolean(
                        formik.touched.answerToChatHour &&
                          formik.errors.answerToChatHour
                      )}
                      helperText={
                        formik.touched.answerToChatHour &&
                        formik.errors.answerToChatHour
                      }
                      sx={{ width: 100 }}
                    />

                    <Typography variant="body2">时</Typography>

                    <TextField
                      type="number"
                      variant="standard"
                      {...formik.getFieldProps("answerToChatMinute")}
                      inputProps={{ min: 0, max: 59, step: 1 }}
                      error={Boolean(
                        formik.touched.answerToChatMinute &&
                          formik.errors.answerToChatMinute
                      )}
                      helperText={
                        formik.touched.answerToChatMinute &&
                        formik.errors.answerToChatMinute
                      }
                      sx={{ width: 100 }}
                    />

                    <Typography variant="body2">分</Typography>
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <Stack direction="row">
                      <Typography variant="button">聊天时间</Typography>

                      <Tooltip title={"提问者和回答者聊天的最长时间"}>
                        <Icon icon={help} width={12} height={12} />
                      </Tooltip>
                    </Stack>

                    <TextField
                      type="number"
                      variant="standard"
                      {...formik.getFieldProps("chatHour")}
                      inputProps={{ min: 0 }}
                      error={Boolean(
                        formik.touched.chatHour && formik.errors.chatHour
                      )}
                      helperText={
                        formik.touched.chatHour && formik.errors.chatHour
                      }
                      sx={{ width: 100 }}
                    />

                    <Typography variant="body2">时</Typography>

                    <TextField
                      type="number"
                      variant="standard"
                      {...formik.getFieldProps("chatMinute")}
                      inputProps={{ min: 0, max: 59, step: 1 }}
                      error={Boolean(
                        formik.touched.chatMinute && formik.errors.chatMinute
                      )}
                      helperText={
                        formik.touched.chatMinute && formik.errors.chatMinute
                      }
                      sx={{ width: 100 }}
                    />

                    <Typography variant="body2">分</Typography>
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <Stack direction="row">
                      <Typography variant="button">最高收费</Typography>

                      <Tooltip title={"回答者能够给自己设置的最高定价"}>
                        <Icon icon={help} width={12} height={12} />
                      </Tooltip>
                    </Stack>

                    <Typography variant="body2">￥</Typography>

                    <TextField
                      type="number"
                      variant="standard"
                      {...formik.getFieldProps("fee")}
                      inputProps={{ min: 0 }}
                      error={Boolean(formik.touched.fee && formik.errors.fee)}
                      helperText={formik.touched.fee && formik.errors.fee}
                      sx={{ width: 100 }}
                    />
                  </Stack>

                  <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={formik.isSubmitting}
                  >
                    提交设置
                  </LoadingButton>
                </Stack>
              </Form>
            </FormikProvider>
          </Card>
        </Container>
      </Page>
    </AdminLayout>
  );
}
