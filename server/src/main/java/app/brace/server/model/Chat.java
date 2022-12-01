package app.brace.server.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Chat {
    @Id
    @GeneratedValue
    private UUID Id;

    @OneToOne
    @JoinColumn(name = "corresponding_order")
    private Order order;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "contents")
    private List<ChatInfo> chatInfoList;

    public Chat(Order order){
        this.order=order;
        this.chatInfoList=new ArrayList<>();
    }

    public void addChatInfo(ChatInfo chatInfo){
        chatInfoList.add(chatInfo);
    }
}
