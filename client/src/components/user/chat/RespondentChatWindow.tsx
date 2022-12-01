import { Box, Divider, Stack } from "@mui/material";
import useOrderStatus from "../../../hooks/qa/useOrderStatus";
import useChatInfoForRespondent from "../../../hooks/user/useChatInfoForRespondent";
import useChatMessages from "../../../hooks/user/useChatMessages";
import useQuestionInfoForChat from "../../../hooks/user/useQuestionInfoForChat";
import ChatHeader from "./ChatHeader";
import ChatMessageInput from "./ChatMessageInput";
import ChatMessageList from "./ChatMessageList";
import RespondentChatInfoBar from "./RespondentChatInfoBar";

interface RespondentChatWindowProps {
  id: string;
}

export default function RespondentChatWindow({
  id,
}: RespondentChatWindowProps): JSX.Element {
  const info = {
    questioner: useChatInfoForRespondent(id),
    question: useQuestionInfoForChat(id),
  };
  const status = useOrderStatus(id);
  const [messageList, onChatMessageSend] = useChatMessages(id);

  return (
    <Stack sx={{ flexGrow: 1, minWidth: "1px" }}>
      <ChatHeader
        avatar={info.questioner.avatar}
        username={info.questioner.username}
        isOnline={info.questioner.isOnline}
        isQuestioner={false}
        orderStatus={status}
      />

      <Divider />

      <Box sx={{ flexGrow: 1, display: "flex", overflow: "hidden" }}>
        <Stack sx={{ flexGrow: 1 }}>
          <ChatMessageList
            avatar={info.questioner.avatar}
            username={info.questioner.username}
            messageList={messageList}
          />

          <Divider />

          {status === "CHATTING" && (
            <ChatMessageInput id={id} onChatMessageSend={onChatMessageSend} />
          )}
        </Stack>
        <RespondentChatInfoBar info={info} />
      </Box>
    </Stack>
  );
}
