import assert from "assert";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import io from "socket.io-client";
import useAuth from "../hooks/user/useAuth";
import { PATH_API_SOCKET } from "../routes/paths";
import { QuestionStatus } from "../types/Question";
import { ChatMessageType } from "../types/user/Chat";

export type ChatMessageReceiveListener = (
  id: string,
  type: ChatMessageType,
  content: string,
  timestamp: Date
) => void | Promise<void>;

export type OrderStatusChangeListener = (
  id: string,
  status: QuestionStatus,
  timestamp: Date
) => void | Promise<void>;

export type RespondentApplyCensoredListener = (
  approved: boolean,
  timestamp: Date
) => void | Promise<void>;

export type OrderCreateListener = (
  id: string,
  timestamp: Date
) => void | Promise<void>;

export type ContextType = {
  onChatMessageSend: (
    id: string,
    type: ChatMessageType,
    content: string
  ) => void;

  subscribeChatMessageReceive: (listener: ChatMessageReceiveListener) => void;
  unsubscribeChatMessageReceive: (listener: ChatMessageReceiveListener) => void;

  subscribeOrderStatusChange: (listener: OrderStatusChangeListener) => void;
  unsubscribeOrderStatusChange: (listener: OrderStatusChangeListener) => void;

  subscribeRespondentApplyCensored: (
    listener: RespondentApplyCensoredListener
  ) => void;
  unsubscribeRespondentApplyCensored: (
    listener: RespondentApplyCensoredListener
  ) => void;

  subscribeOrderCreate: (listener: OrderCreateListener) => void;
  unsubscribeOrderCreate: (listener: OrderCreateListener) => void;
};

export const Context = createContext<ContextType | null>(null);

type SocketIoResponse = {
  type:
    | "CENSOR_PASS" // 订单审核通过（提问者）
    | "CENSOR_FAIL" // 订单审核失败（提问者）
    | "ORDER_NEW" // 订单审核通过（回答者）
    | "RESPONDENT_REFUSE" // 订单被拒绝（提问者）
    | "RESPONDENT_CENSOR_PASS" // 回答者审核通过
    | "RESPONDENT_CENSOR_REFUSE" // 回答者审核失败
    | "CHAT_TEXT"
    | "CHAT_FILE"
    | "CHAT_IMG";
  information: string;
  receiver: string;
  sender: string;
  id: string;
  timestamp: Date;
};

const chatMessageReceiveListeners = new Set<ChatMessageReceiveListener>();
const orderStatusChangeListeners = new Set<OrderStatusChangeListener>();
const respondentApplyCensoredListeners =
  new Set<RespondentApplyCensoredListener>();
const orderCreateListeners = new Set<OrderCreateListener>();

export function Provider({ children }: { children: ReactNode }): JSX.Element {
  const auth = useAuth();
  const [socket, setSocket] = useState(io({ autoConnect: false }));

  useEffect(() => {
    const token = auth.getAccessToken();
    if (token !== null) {
      const socket = io(PATH_API_SOCKET(token));
      socket.on("push_event", (response: SocketIoResponse) => {
        switch (response.type) {
          case "CENSOR_PASS":
            orderStatusChangeListeners.forEach(listener =>
              listener(response.id, "待接单", response.timestamp)
            );
            break;
          case "CENSOR_FAIL":
            orderStatusChangeListeners.forEach(listener =>
              listener(response.id, "审核不通过", response.timestamp)
            );
            break;
          case "ORDER_NEW":
            orderCreateListeners.forEach(listener =>
              listener(response.id, response.timestamp)
            );
            break;
          case "RESPONDENT_REFUSE":
            orderStatusChangeListeners.forEach(listener =>
              listener(response.id, "订单失败", response.timestamp)
            );
            break;
          case "RESPONDENT_CENSOR_PASS":
            respondentApplyCensoredListeners.forEach(listener =>
              listener(true, response.timestamp)
            );
            break;
          case "RESPONDENT_CENSOR_REFUSE":
            respondentApplyCensoredListeners.forEach(listener =>
              listener(false, response.timestamp)
            );
            break;
          case "CHAT_TEXT":
            chatMessageReceiveListeners.forEach(listener =>
              listener(
                response.id,
                "TEXT",
                response.information,
                response.timestamp
              )
            );
            break;
          case "CHAT_FILE":
            chatMessageReceiveListeners.forEach(listener =>
              listener(
                response.id,
                "FILE",
                response.information,
                response.timestamp
              )
            );
            break;
          case "CHAT_IMG":
            chatMessageReceiveListeners.forEach(listener =>
              listener(
                response.id,
                "IMG",
                response.information,
                response.timestamp
              )
            );
            break;
        }
      });
      setSocket(socket);
      return () => {
        socket.disconnect();
      };
    }
  }, [auth]);

  const onChatMessageSend = useCallback(
    (id: string, type: ChatMessageType, content: string) => {
      const token = auth.getAccessToken();
      assert(token !== null);
      socket.emit("text", { token, id, type: type.toLowerCase(), content });
    },
    [auth, socket]
  );

  const subscribeChatMessageReceive = useCallback(
    (listener: ChatMessageReceiveListener) => {
      chatMessageReceiveListeners.add(listener);
    },
    []
  );
  const unsubscribeChatMessageReceive = useCallback(
    (listener: ChatMessageReceiveListener) => {
      chatMessageReceiveListeners.delete(listener);
    },
    []
  );

  const subscribeOrderStatusChange = useCallback(
    (listener: OrderStatusChangeListener) => {
      orderStatusChangeListeners.add(listener);
    },
    []
  );
  const unsubscribeOrderStatusChange = useCallback(
    (listener: OrderStatusChangeListener) => {
      orderStatusChangeListeners.delete(listener);
    },
    []
  );

  const subscribeRespondentApplyCensored = useCallback(
    (listener: RespondentApplyCensoredListener) => {
      respondentApplyCensoredListeners.add(listener);
    },
    []
  );
  const unsubscribeRespondentApplyCensored = useCallback(
    (listener: RespondentApplyCensoredListener) => {
      respondentApplyCensoredListeners.delete(listener);
    },
    []
  );

  const subscribeOrderCreate = useCallback((listener: OrderCreateListener) => {
    orderCreateListeners.add(listener);
  }, []);
  const unsubscribeOrderCreate = useCallback(
    (listener: OrderCreateListener) => {
      orderCreateListeners.delete(listener);
    },
    []
  );

  return (
    <Context.Provider
      value={{
        onChatMessageSend,

        subscribeChatMessageReceive,
        unsubscribeChatMessageReceive,

        subscribeOrderStatusChange,
        unsubscribeOrderStatusChange,

        subscribeRespondentApplyCensored,
        unsubscribeRespondentApplyCensored,

        subscribeOrderCreate,
        unsubscribeOrderCreate,
      }}
    >
      {children}
    </Context.Provider>
  );
}
