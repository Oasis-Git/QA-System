import { Grid, Stack } from "@mui/material";
import ProfileAbout from "./ProfileAbout";
import ProfilePostCard from "./ProfilePostCard";
import ProfileQuestionInput from "./ProfileQuestionInput";
import ProfileStatistics from "./ProfileStatistics";
import ProfileSocialInfo from "./ProfileSocialInfo";
import ProfileApplyCard from "./ProfileApplyCard";

type PastAnswer = {
  time: string;
  title: string;
};
interface ProfileProps {
  username: string;
  isRespondent: boolean;
  nameInUrl: string;
  avatar: string;
  answerNum: number;
  ratings: number;
  description: string;
  location: string;
  email: string;
  specialties: string[];
  weChat: string;
  weibo: string;
  pastAnswers: PastAnswer[];
}

export default function Profile({
  username,
  isRespondent,
  nameInUrl,
  avatar,
  answerNum,
  ratings,
  description,
  location,
  email,
  specialties,
  weChat,
  weibo,
  pastAnswers,
}: ProfileProps): JSX.Element {
  const postQuestionCard = (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <ProfileStatistics answerNum={answerNum} ratings={ratings} />
          <ProfileAbout
            isRespondent={isRespondent}
            description={description}
            location={location}
            email={email}
            specialties={specialties}
          />
          <ProfileSocialInfo weChat={weChat} weibo={weibo} />
        </Stack>
      </Grid>

      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          <ProfileQuestionInput />
          {pastAnswers.map(pastAnswer => (
            <ProfilePostCard
              key={pastAnswer.title}
              username={username}
              avatar={avatar}
              time={pastAnswer.time}
              title={pastAnswer.title}
            />
          ))}
        </Stack>
      </Grid>
    </Grid>
  );

  const applyCard = (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <ProfileAbout
            isRespondent={isRespondent}
            description={description}
            location={location}
            email={email}
            specialties={specialties}
          />
          <ProfileSocialInfo weChat={weChat} weibo={weibo} />
        </Stack>
      </Grid>

      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          <ProfileApplyCard />
        </Stack>
      </Grid>
    </Grid>
  );

  if (isRespondent) {
    return nameInUrl === "" ? (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <ProfileStatistics answerNum={answerNum} ratings={ratings} />
            <ProfileAbout
              isRespondent={isRespondent}
              description={description}
              location={location}
              email={email}
              specialties={specialties}
            />
            <ProfileSocialInfo weChat={weChat} weibo={weibo} />
          </Stack>
        </Grid>

        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {pastAnswers.map(pastAnswer => (
              <ProfilePostCard
                key={pastAnswer.title}
                username={username}
                avatar={avatar}
                time={pastAnswer.time}
                title={pastAnswer.title}
              />
            ))}
          </Stack>
        </Grid>
      </Grid>
    ) : (
      <>{postQuestionCard}</>
    );
  } else {
    //对于用户，空字符串填写“暂无”
    return nameInUrl === "" ? <>{applyCard}</> : <>{postQuestionCard}</>;
  }
}
