import { Card, Container } from "@mui/material";
import { useParams } from "react-router-dom";
import HeaderBreadcrumbs from "../../components/general/HeaderBreadcrumbs";

// components
import Page from "../../components/general/Page";
import { Profile, ProfileCover } from "../../components/qa/profile";
import useProfile from "../../hooks/user/useProfile";
import { fDateTimeSuffix } from "../../utils/formatTime";

export default function RespondentProfile(): JSX.Element {
  const { name = "" } = useParams();
  const profile = useProfile(name);

  const respondentProfile = profile.respondentProfile || {
    answerCount: -1,
    description: "暂无",
    fee: -1,
    pinnedAnswers: [],
    rating: -1,
    specialities: [],
    detail: "暂无",
  };

  return (
    <Page title="Respondent: Profile">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading="简介"
          links={[{ name: "回答者列表", href: "/qa/list" }]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: "relative",
          }}
        >
          <ProfileCover avatar={profile.avatar} username={profile.username} />
        </Card>

        <Profile
          username={profile.username}
          isRespondent={profile.respondentProfile !== null}
          nameInUrl={name}
          avatar={profile.avatar}
          answerNum={respondentProfile.answerCount}
          ratings={respondentProfile.rating}
          description={respondentProfile.description}
          location={profile.location}
          email={profile.email}
          specialties={respondentProfile.specialities}
          weChat={profile.contacts.wechat || "暂无"}
          weibo={profile.contacts.weibo || "暂无"}
          pastAnswers={respondentProfile.pinnedAnswers.map(answer => ({
            title: answer.title,
            time: fDateTimeSuffix(answer.answeredAt),
          }))}
        />
      </Container>
    </Page>
  );
}
