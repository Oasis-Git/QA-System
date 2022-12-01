package app.brace.server.model;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class PushMessage {
    private InformationType type;
    private String information;
    private String receiver;
    private String sender;
    private String id;
    private String timestamp;

    public PushMessage(InformationType type,String information,String receiver,String sender,String id,String timestamp){
        this.type=type;
        this.information=information;
        this.receiver=receiver;
        this.sender=sender;
        this.id=id;
        this.timestamp=timestamp;
    }

}
