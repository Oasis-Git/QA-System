package app.brace.server.model;

import lombok.*;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

import java.time.Instant;
import java.util.UUID;

@SuppressWarnings("LombokEqualsAndHashCodeInspection")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = "id")
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue
    @Column(updatable = false)
    private UUID id;

    @Setter
    @Column(nullable = false)
    private String title;

    @Setter
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @OneToOne
    @JoinColumn(name = "questioner", updatable = false)
    private User questioner;

    @OneToOne
    @JoinColumn(name = "respondent", updatable = false)
    private User respondent;

    @Setter
    @ManyToOne
    @JoinColumn(name = "status")
    private Status status;

    @Setter
    @Column(name = "first_answer")
    private String firstAnswer;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Setter
    @Column
    private Instant firstAnswerAt;

    @Setter
    @Column
    private Instant censoredAt;

    @Setter
    @Column
    private Instant acceptedAt;

    @Setter
    @Column
    private Instant chatAt;

    // 考虑到当且仅当 title、description 和 status 可以发生变化，
    // 而这些都意味着进入下一个状态，因此只需一个 update 时间即可用于判断超时
    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;

    @Column(name = "isPublic")
    boolean isPublic;

    @Setter
    @Column(name = "rating")
    private Float rating;

    @Column(name = "fee")
    private Long fee;

    public Order(final @NotNull String title, final @NotNull String description, final @NotNull User questioner,
            final @NotNull User respondent, final @NotNull Status status, final boolean isPublic, final Long fee) {
        this.title = title;
        this.description = description;
        this.questioner = questioner;
        this.respondent = respondent;
        this.status = status;
        this.firstAnswer = null;
        this.isPublic = isPublic;
        this.rating = 0.0F;
        this.fee = fee;
        this.acceptedAt=Instant.now();
        this.censoredAt=Instant.now();
        this.chatAt=Instant.now();
        this.firstAnswerAt=Instant.now();
    }
}
