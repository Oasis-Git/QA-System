import { useParams } from "react-router-dom";
// material
import { Container } from "@mui/material";
import Page from "../../components/general/Page";
import HeaderBreadcrumbs from "../../components/general/HeaderBreadcrumbs";
import { PATH_DASHBOARD } from "../../routes/paths";
import AnswerQuestion from "../../components/qa/AnswerQuestion";
import useQuestionInfo from "../../hooks/qa/useQuestionInfo";

export default function PostQuestion(): JSX.Element {
  const { id = "" } = useParams();
  const { title, description } = useQuestionInfo(id);

  return (
    <Page title="回答问题">
      <Container maxWidth={"lg"}>
        <HeaderBreadcrumbs
          heading={"回答问题"}
          links={[
            { name: "订单列表", href: PATH_DASHBOARD.questions },
            { name: id },
          ]}
        />

        <AnswerQuestion
          questionID={id}
          title={title}
          description={description}
        />
      </Container>
    </Page>
  );
}
