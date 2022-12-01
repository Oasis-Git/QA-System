import { Button, Card, Container, Stack, Typography } from "@mui/material";
// material
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import HeaderBreadcrumbs from "../../components/general/HeaderBreadcrumbs";
import Markdown from "../../components/general/Markdown";
// components
import Page from "../../components/general/Page";
import useAcceptOrder from "../../hooks/qa/useAcceptOrder";
import useQuestionInfo from "../../hooks/qa/useQuestionInfo";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
import { useSnackbar } from "notistack";
// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export default function AcceptOrder(): JSX.Element {
  const { id = "" } = useParams(); //订单编号
  const { title, description } = useQuestionInfo(id);
  const acceptOrder = useAcceptOrder();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleAccept = async () => {
    const message = await acceptOrder(id, true);
    if (message === null) {
      enqueueSnackbar("订单已接受", {
        variant: "success",
      });
      navigate(PATH_DASHBOARD.questions);
    }
  };

  const handleRefuse = async () => {
    const message = await acceptOrder(id, false);
    if (message === null) {
      enqueueSnackbar("订单已拒绝", {
        variant: "success",
      });
      navigate(PATH_DASHBOARD.questions);
    }
  };

  return (
    <Page title="接受订单">
      <Container maxWidth={"lg"}>
        <HeaderBreadcrumbs
          heading="接受订单"
          links={[
            { name: "问题列表", href: PATH_DASHBOARD.questions },
            { name: id },
          ]}
        />

        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Typography variant="h3" gutterBottom>
              {title}
            </Typography>

            <div>
              <LabelStyle>问题描述</LabelStyle>
              <Markdown>{description}</Markdown>
            </div>

            <Stack direction="row" justifyContent="center">
              <Button
                onClick={handleAccept}
                fullWidth
                variant="contained"
                size="large"
                sx={{ mr: 1.5 }}
              >
                {"接受订单"}
              </Button>

              <Button
                onClick={handleRefuse}
                fullWidth
                variant="contained"
                size="large"
                color="error"
                sx={{ ml: 1.5 }}
              >
                {"拒绝订单"}
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </Page>
  );
}
