import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { PATH_API_USER } from "../../routes/paths";
import { ApiResponse } from "../../types/ApiResponse";
import { ChatMessage, ChatMessageType } from "../../types/user/Chat";
import useSocketIo from "../useSocketIo";

const useChatMessages = (
  id: string
): [
  ChatMessage[],
  (id: string, type: ChatMessageType, content: string) => void
] => {
  const socket = useSocketIo();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(messages => messages.concat(message));
  }, []);
  const chatMessageListener = useCallback(
    (id_: string, type: ChatMessageType, content: string, timestamp: Date) => {
      if (id_ === id) {
        addMessage({
          messageType: type,
          isMe: false,
          content,
          timestamp,
        });
      }
    },
    [addMessage, id]
  );
  const onChatMessageSend = useCallback(
    (id: string, type: ChatMessageType, content: string) => {
      socket.onChatMessageSend(id, type, content);
      addMessage({
        messageType: type,
        isMe: true,
        content,
        timestamp: new Date(),
      });
    },
    [addMessage, socket]
  );

  useEffect(() => {
    axios
      .get(PATH_API_USER.chatMessages(id))
      .then(response => {
        const data = response.data as ApiResponse<ChatMessage[]>;
        setMessages(data.data);
      })
      .catch(exception => {
        console.log(exception);
        throw exception;
      });
  }, [id]);
  useEffect(() => {
    socket.subscribeChatMessageReceive(chatMessageListener);
    return () => {
      socket.unsubscribeChatMessageReceive(chatMessageListener);
    };
  }, [chatMessageListener, socket]);

  return [messages, onChatMessageSend];
};
export default useChatMessages;
