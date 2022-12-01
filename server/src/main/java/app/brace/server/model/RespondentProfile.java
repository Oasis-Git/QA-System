package app.brace.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.Instant;
import java.util.List;

@SuppressWarnings("LombokEqualsAndHashCodeInspection")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = "username")
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "respondent_profile")
public class RespondentProfile {
    @Id
    @Column(updatable = false)
    private String username;

    @JsonIgnore
    @MapsId
    @OneToOne
    @JoinColumn(name = "username", updatable = false)
    private User user; // user 必须为回答者

    @Setter
    @ManyToMany
    @JoinTable(
            name = "respondent_specialities",
            joinColumns = @JoinColumn(name = "username", updatable = false),
            inverseJoinColumns = @JoinColumn(name = "speciality")
    )
    private List<Speciality> specialities;

    @Setter
    private long fee;

    @Setter
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Setter
    @Column(nullable = false, columnDefinition = "TEXT")
    private String detail;

    @Setter
    private Integer times;

    // 用于指示用户申请成为回答者的时间
    // 这种用户的 role 还是 user，但有回答者 profile
    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;

    @Setter
    private long incomes;

    @Setter
    private Float rating;

    @Setter
    @ManyToOne
    @JoinTable(
            name = "respondent_profile_status",
            joinColumns = @JoinColumn(name = "username", updatable = false),
            inverseJoinColumns = @JoinColumn(name = "status_name")
    )
    private RespondentProfileStatus status;

    @Setter
    private Integer answerCounts;

    public RespondentProfile(final @NotNull User user,
                             final @NotNull List<Speciality> specialities,
                             final long fee,
                             final @NotNull String description,
                             final @NotNull String detail,
                             final @NotNull RespondentProfileStatus status)
    {
        this.user = user;
        this.specialities = specialities;
        this.fee = fee;
        this.description = description;
        this.detail = detail;
        this.incomes = 0;
        this.rating = 0.0F;
        this.status = status;
        this.times = 0;
        this.answerCounts = 0;
    }
}
