import { Card, Container } from "@mui/material";
import { useParams } from "react-router-dom";
import HeaderBreadcrumbs from "../../components/general/HeaderBreadcrumbs";
import Page from "../../components/general/Page";
import QuestionerChatWindow from "../../components/user/chat/QuestionerChatWindow";
import RespondentChatWindow from "../../components/user/chat/RespondentChatWindow";
import useChatRole from "../../hooks/user/useChatRole";
import { PATH_DASHBOARD } from "../../routes/paths";

export default function Chat(): JSX.Element {
  const { id = "" } = useParams();
  const myRole = useChatRole(id);

  const headerLinks =
    myRole === "questioner"
      ? [
          { name: "个人空间", href: PATH_DASHBOARD.profile },
          { name: "我的订单", href: PATH_DASHBOARD.orders },
          { name: "聊天" },
        ]
      : myRole === "respondent"
      ? [
          { name: "个人空间", href: PATH_DASHBOARD.profile },
          { name: "我回答的问题", href: PATH_DASHBOARD.questions },
          { name: "聊天" },
        ]
      : [];

  const chatWindow =
    myRole === "questioner" ? (
      <QuestionerChatWindow id={id} />
    ) : myRole === "respondent" ? (
      <RespondentChatWindow id={id} />
    ) : (
      <></>
    );

  return (
    <Page title="聊天">
      <Container>
        <HeaderBreadcrumbs heading="聊天" links={headerLinks} />
        <Card sx={{ height: "100vh", display: "flex" }}>{chatWindow}</Card>
      </Container>
    </Page>
  );
}
