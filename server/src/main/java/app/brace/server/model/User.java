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
@Table(name = "users")
public class User extends UserModel {
    @Setter
    @ManyToOne
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "username", updatable = false),
            inverseJoinColumns = @JoinColumn(name = "role_name")
    )
    private UserRole role;

    public User(final @NotNull String username,
                final @NotNull String password,
                final @NotNull UserRole role)
    {
        super(username, password);
        this.role = role;
    }
}
