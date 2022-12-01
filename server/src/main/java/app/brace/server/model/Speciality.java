package app.brace.server.model;

import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

import javax.persistence.*;
import java.util.Set;

@SuppressWarnings("LombokEqualsAndHashCodeInspection")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = "value")
@Entity
@Table(name = "specialities")
public class Speciality {
    @Id
    @Column(updatable = false)
    private String value;

    @ManyToMany(mappedBy = "specialities")
    private Set<RespondentProfile> respondentProfiles;

    public Speciality(final @NotNull String value) {
        this.value = value;
        this.respondentProfiles = Set.of();
    }
}
