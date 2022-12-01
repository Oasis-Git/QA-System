package app.brace.server.model;

import lombok.*;

import javax.persistence.*;

@SuppressWarnings("LombokEqualsAndHashCodeInspection")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EqualsAndHashCode(of = "name")
@Entity
@Table(name = "user_roles")
public class UserRole implements Role {
    @Id
    @Enumerated(EnumType.STRING)
    @Column(updatable = false, length = 20)
    private UserRoleName name;
}
