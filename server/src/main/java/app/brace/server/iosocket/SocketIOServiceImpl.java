package app.brace.server.iosocket;

import app.brace.server.model.*;
import app.brace.server.repository.ChatInfoRepository;
import app.brace.server.repository.ChatRepository;
import app.brace.server.repository.OrderRepository;
import app.brace.server.security.JwtProvider;
import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service(value = "socketIOService")
public class SocketIOServiceImpl implements SocketIOService {

    // 用来存已连接的客户端
    private static Map<String, SocketIOClient> clientMap = new ConcurrentHashMap<>();

    @Autowired
    private SocketIOServer socketIOServer;

    @Autowired
    JwtProvider jwtProvider;
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    ChatRepository chatRepository;
    @Autowired
    ChatInfoRepository chatInfoRepository;

    @PostConstruct
    private void autoStartup() throws Exception {
        start();
    }

    @PreDestroy
    private void autoStop() throws Exception {
        stop();
    }

    @Override
    public void start() throws Exception {
        // 监听客户端连接
        socketIOServer.addConnectListener(client -> {
            String username = getParamsByClient(client);
            if (username != null) {
                SocketIOServiceImpl.log.info(username + '\n'
                        + "Session ID: " + client.getSessionId() + '\n'
                        + "Remote Address: " + client.getRemoteAddress() + '\n'
                        + "Transport: " + client.getTransport());
                client.set("username", username);
                this.clientMap.put(username, client);
            }
        });

        // 监听客户端断开连接
        socketIOServer.addDisconnectListener(client -> {
            final String username = client.get("username");
            assert username != null;
            this.clientMap.remove(username);
            SocketIOServiceImpl.log.info("断开连接: " + username + '\n'
                    + "Session ID: " + client.getSessionId());
        });

        // 处理自定义的事件，与连接监听类似
        socketIOServer.addEventListener("text", Map.class, this::getMessage);

        socketIOServer.start();
    }

    @Transactional
    public void getMessage(SocketIOClient client, Map<String, Object> data, AckRequest ackSender) {
        client.getHandshakeData();
        InformationType informationType = switch (data.get("type").toString()) {
            case "file" -> InformationType.CHAT_FILE;
            case "img" -> InformationType.CHAT_IMG;
            default -> InformationType.CHAT_TEXT;
        };

        ChatType chatType = switch (data.get("type").toString()) {
            case "file" -> ChatType.FILE;
            case "img" -> ChatType.IMG;
            default -> ChatType.TEXT;
        };

        Chat chat = chatRepository.getByOrder(
                orderRepository.getById(UUID.fromString(data.get("id").toString())));
        ChatInfo chatInfo = new ChatInfo(data.get("content").toString(), chatType, GroupName.withoutGroupSuffix(Objects.requireNonNull(jwtProvider.getUsernameWithGroupSuffix(data.get("token").toString()))));
        chatInfoRepository.save(chatInfo);
        chat.addChatInfo(chatInfo);
        chatRepository.save(chat);

        String receiver = chat.getOrder().getQuestioner().getUsername().equals(
                GroupName.withoutGroupSuffix(Objects.requireNonNull(jwtProvider.getUsernameWithGroupSuffix(data.get("token").toString())))) ?
                chat.getOrder().getRespondent().getUsername() : chat.getOrder().getQuestioner().getUsername();

        pushMessageToUser(new PushMessage(
                informationType,
                data.get("content").toString(),
                receiver,
                GroupName.withoutGroupSuffix(Objects.requireNonNull(jwtProvider.getUsernameWithGroupSuffix(data.get("token").toString()))),
                data.get("id").toString(),
                Instant.now().toString()
        ));
    }

    @Override
    public void stop() {
        if (socketIOServer != null) {
            socketIOServer.stop();
            socketIOServer = null;
        }
    }

    public void PushCensorSuccessToUser(String questioner, String respondent, UUID id) {
        SocketIOServiceImpl.log.info("订单通过: " + questioner + respondent);

        pushMessageToUser(new PushMessage(InformationType.CENSOR_PASS,
                "订单审核通过",
                questioner,
                "ADMIN",
                id.toString(),
                Instant.now().toString()
        ));
        pushMessageToUser(new PushMessage(InformationType.ORDER_NEW,
                "您有新的订单",
                respondent,
                "ADMIN",
                id.toString(),
                Instant.now().toString()
        ));
    }

    public void PushCensorFailToUser(String questioner, UUID id) {
        pushMessageToUser(new PushMessage(
                InformationType.CENSOR_FAIL,
                "订单审核失败",
                questioner,
                "ADMIN",
                id.toString(),
                Instant.now().toString()
        ));
    }

    public void pushCensorRespondentSuccessToUser(String user) {
        pushMessageToUser(new PushMessage(
                InformationType.RESPONDENT_CENSOR_PASS,
                "您已成为回答者",
                user,
                "ADMIN",
                "-1",
                Instant.now().toString()
        ));
    }

    public void pushCensorRespondentFailToUser(String user) {
        pushMessageToUser(new PushMessage(
                InformationType.RESPONDENT_CENSOR_REFUSE,
                "申请成为回答者已被拒绝",
                user,
                "ADMIN",
                "-1",
                Instant.now().toString()
        ));
    }

    public void PushOrderRefused(String questioner, UUID id) {
        pushMessageToUser(new PushMessage(
                InformationType.RESPONDENT_REFUSE,
                "回答者未接受订单",
                questioner,
                "ADMIN",
                id.toString(),
                Instant.now().toString()
        ));
    }

    public void PushOrderAccept(String questioner, UUID id) {
        SocketIOServiceImpl.log.info("订单接收: " + questioner);

        pushMessageToUser(new PushMessage(
                InformationType.RESPONDENT_ACCEPT,
                "回答者已接受订单",
                questioner,
                "ADMIN",
                id.toString(),
                Instant.now().toString()
        ));
    }

    @Override
    public void pushMessageToUser(PushMessage pushMessage) {
        String username = pushMessage.getReceiver();
        SocketIOClient client = clientMap.get(username);
        if (client != null) {
            client.sendEvent(PUSH_EVENT, pushMessage);
        } // 否则是在测试
    }

    /**
     * 此方法为获取client连接中的参数，可根据需求更改
     */
    private String getParamsByClient(SocketIOClient client) {
        // 从请求的连接中拿出参数（这里的loginUserNum必须是唯一标识）
        Map<String, List<String>> params = client.getHandshakeData().getUrlParams();
        List<String> token = params.get("token");
        if (token != null && token.size() > 0) {
            return GroupName.withoutGroupSuffix(Objects.requireNonNull(jwtProvider.getUsernameWithGroupSuffix(token.get(0))));
        }
        return null;
    }

    public static Map<String, SocketIOClient> getClientMap() {
        return clientMap;
    }

    public static void setClientMap(Map<String, SocketIOClient> clientMap) {
        SocketIOServiceImpl.clientMap = clientMap;
    }

    public boolean ifOnline(String username) {
        return clientMap.containsKey(username);
    }
}