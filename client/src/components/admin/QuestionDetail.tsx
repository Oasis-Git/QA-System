import Arrow from "@iconify/icons-ic/round-arrow-circle-right";
import { Icon } from "@iconify/react";
import {
  Avatar,
  Container,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import Markdown from "../../components/general/Markdown";
import useQuestionDetail from "../../hooks/admin/useQuestionDetail";
import { fDateTime } from "../../utils/formatTime";

interface QuestionDetailProps {
  questionId: string;
}

export default function QuestionDetail({
  questionId,
}: QuestionDetailProps): JSX.Element {
  const question = useQuestionDetail(questionId);

  return (
    <Container>
      <ListItem
        sx={{
          alignItems: "flex-start",
          py: 3,
        }}
      >
        <ListItemAvatar>
          <Avatar
            alt={question.questioner}
            src={question.questionerAvatar}
            sx={{ width: 48, height: 48 }}
          />
        </ListItemAvatar>

        <ListItemText
          sx={{ maxWidth: 200 }}
          primary={question.questioner}
          primaryTypographyProps={{ variant: "subtitle1" }}
          secondary={
            <>
              <Typography
                gutterBottom
                variant="caption"
                sx={{ display: "block", color: "text.disabled" }}
              >
                {fDateTime(question.createdAt)}
              </Typography>
              <Typography component="span" variant="subtitle2">
                {question.title}
              </Typography>
            </>
          }
        />

        <Icon icon={Arrow} width={30} height={30} />

        <Stack spacing={2} alignItems="center" direction="row" sx={{ pl: 10 }}>
          <Avatar
            alt={question.respondent}
            src={question.respondentAvatar}
            sx={{ width: 48, height: 48 }}
          />
          <Typography variant="subtitle1" noWrap>
            {question.respondent}
          </Typography>
        </Stack>
      </ListItem>

      <div>
        <Markdown>{question.description}</Markdown>
      </div>
    </Container>
  );
}
