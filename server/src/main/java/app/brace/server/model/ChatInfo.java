package app.brace.server.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.time.Instant;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ChatInfo {
    @Id
    @GeneratedValue
    UUID Id;

    private String info;
    private ChatType type;
    private String sayer;
    private Instant postTime;

    public ChatInfo(String info,ChatType type,String sayer){
        this.info=info;
        this.type=type;
        this.sayer=sayer;
        postTime=Instant.now();
    }
}
