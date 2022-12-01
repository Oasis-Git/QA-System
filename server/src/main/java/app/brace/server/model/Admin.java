package app.brace.server.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jetbrains.annotations.NotNull;

import javax.persistence.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "admins")
public class Admin extends UserModel {
    @Setter
    @ManyToOne
    @JoinTable(
            name = "admin_role",
            joinColumns = @JoinColumn(name = "username"),
            inverseJoinColumns = @JoinColumn(name = "role_name")
    )
    private AdminRole role;

    @Setter
    private boolean activated;

    public Admin(final @NotNull String username,
                 final @NotNull String password,
                 final @NotNull AdminRole role,
                 final boolean activated)
    {
        super(username, password);
        this.role = role;
        this.activated = activated;
    }
}
