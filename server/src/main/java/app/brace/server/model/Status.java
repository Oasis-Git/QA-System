package app.brace.server.model;

import lombok.*;

import javax.persistence.*;

@SuppressWarnings("LombokEqualsAndHashCodeInspection")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EqualsAndHashCode(of = "name")
@Entity
@Table(name = "statuses")
public class Status {
    @Id
    @Enumerated(EnumType.STRING)
    @Column(updatable = false, length = 15)
    private StatusName name;
}
