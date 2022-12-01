package app.brace.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.NaturalId;
import org.jetbrains.annotations.NotNull;

import javax.persistence.*;

@SuppressWarnings("LombokEqualsAndHashCodeInspection")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = "username")
@Entity
@Table(name = "user_profile")
public class UserProfile {
    @Id
    @Column(updatable = false)
    private String username;

    @JsonIgnore
    @MapsId
    @OneToOne
    @JoinColumn(name = "username", updatable = false)
    private User user;

    @Setter
    @NaturalId
    private String email;

    @Setter
    private long remaining;

    @Setter
    private String avatar;

    @Setter
    private String wechat;

    @Setter
    private String weibo;

    @Setter
    private String location;

    @Setter
    private long expenses;

    public UserProfile(final @NotNull User user, final @NotNull String email, final String avatar) {
        this.user = user;
        this.email = email;
        this.remaining = 0;
        this.avatar = avatar;
        this.wechat = "无";
        this.weibo = "无";
        this.location = "无";
        this.expenses = 0;
    }
}
