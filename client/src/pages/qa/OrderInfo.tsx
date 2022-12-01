import { Card, Container, Stack, Typography } from "@mui/material";
// material
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import HeaderBreadcrumbs from "../../components/general/HeaderBreadcrumbs";
import Markdown from "../../components/general/Markdown";
// components
import Page from "../../components/general/Page";
import useQuestionInfo from "../../hooks/qa/useQuestionInfo";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export default function OrderInfo(): JSX.Element {
  const { id = "" } = useParams(); //订单编号
  const { title, description } = useQuestionInfo(id);

  return (
    <Page title="订单详情">
      <Container maxWidth={"lg"}>
        <HeaderBreadcrumbs
          heading="订单详情"
          links={[
            { name: "订单列表", href: PATH_DASHBOARD.orders },
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
          </Stack>
        </Card>
      </Container>
    </Page>
  );
}
