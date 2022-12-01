package app.brace.server.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Settings {
    @Id
    private String fake;

    private long maxFee;

    private String beforeAccept;

    private String acceptToAnswer;

    private String answerToChat;

    private String chat;
}
