import { Box, Divider, Stack } from "@mui/material";
import useOrderStatus from "../../../hooks/qa/useOrderStatus";
import useChatInfoForQuestioner from "../../../hooks/user/useChatInfoForQuestioner";
import useChatMessages from "../../../hooks/user/useChatMessages";
import useQuestionInfoForChat from "../../../hooks/user/useQuestionInfoForChat";
import ChatHeader from "./ChatHeader";
import ChatMessageInput from "./ChatMessageInput";
import ChatMessageList from "./ChatMessageList";
import QuestionerChatInfoBar from "./QuestionerChatInfoBar";

interface QuestionerChatWindowProps {
  id: string;
}

export default function QuestionerChatWindow({
  id,
}: QuestionerChatWindowProps): JSX.Element {
  const info = {
    respondent: useChatInfoForQuestioner(id),
    question: useQuestionInfoForChat(id),
  };
  const status = useOrderStatus(id);
  const [messageList, onChatMessageSend] = useChatMessages(id);

  return (
    <Stack sx={{ flexGrow: 1, minWidth: "1px" }}>
      <ChatHeader
        avatar={info.respondent.avatar}
        username={info.respondent.username}
        isOnline={info.respondent.isOnline}
        isQuestioner={true}
        orderStatus={status}
      />

      <Divider />

      <Box sx={{ flexGrow: 1, display: "flex", overflow: "hidden" }}>
        <Stack sx={{ flexGrow: 1 }}>
          <ChatMessageList
            avatar={info.respondent.avatar}
            username={info.respondent.username}
            messageList={messageList}
          />

          <Divider />

          {status === "CHATTING" && (
            <ChatMessageInput id={id} onChatMessageSend={onChatMessageSend} />
          )}
        </Stack>
        <QuestionerChatInfoBar info={info} />
      </Box>
    </Stack>
  );
}
