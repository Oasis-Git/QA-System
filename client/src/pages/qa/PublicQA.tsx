import { Card, Container, Stack, Typography } from "@mui/material";
// material
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import HeaderBreadcrumbs from "../../components/general/HeaderBreadcrumbs";
import Markdown from "../../components/general/Markdown";
// components
import Page from "../../components/general/Page";
import useOpenQuestionDetail from "../../hooks/qa/useOpenQuestionDetail";
// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export default function PublicQA(): JSX.Element {
  const { id = "" } = useParams(); //订单编号
  const { title, description, answer } = useOpenQuestionDetail(id);

  const headerLinks = [{ name: "主页", href: "/" }, { name: id }];

  return (
    <Page title="问答详情">
      <Container maxWidth={"lg"}>
        <HeaderBreadcrumbs heading="问答详情" links={headerLinks} />

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
              <LabelStyle>回答</LabelStyle>
              <Markdown>{answer}</Markdown>
            </div>
          </Stack>
        </Card>
      </Container>
    </Page>
  );
}
