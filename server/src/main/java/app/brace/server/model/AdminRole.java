package app.brace.server.model;

import lombok.*;

import javax.persistence.*;

@SuppressWarnings("LombokEqualsAndHashCodeInspection")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EqualsAndHashCode(of = "name")
@Entity
@Table(name = "admin_roles")
public class AdminRole implements Role {
    @Id
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private AdminRoleName name;
}
