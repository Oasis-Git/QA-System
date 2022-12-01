package app.brace.server.model;

import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

import javax.persistence.*;
import java.util.List;

@SuppressWarnings("LombokEqualsAndHashCodeInspection")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = "name")
@Entity
@Table(name = "respondent_profile_statuses")
public class RespondentProfileStatus {
    @Id
    @Enumerated(EnumType.STRING)
    @Column(updatable = false, length = 15)
    private RespondentProfileStatusName name;

    @OneToMany(mappedBy = "status")
    private List<RespondentProfile> profiles;

    public RespondentProfileStatus(final @NotNull RespondentProfileStatusName name) {
        this.name = name;
        this.profiles = List.of();
    }
}
