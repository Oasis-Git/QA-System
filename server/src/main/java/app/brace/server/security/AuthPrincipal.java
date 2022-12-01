package app.brace.server.security;

import app.brace.server.model.GroupName;
import app.brace.server.model.RoleName;
import app.brace.server.model.UserModel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Unmodifiable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * 此处 {@code getUsername} 返回的是带后缀的 username，需要注意！
 */
@SuppressWarnings("ClassCanBeRecord")
@Getter
@AllArgsConstructor
public class AuthPrincipal implements UserDetails {
    private final String username;
    private final String password;
    private final RoleName roleName;

    public static @NotNull AuthPrincipal from(final @NotNull UserModel user) {
        return new AuthPrincipal(user.getUsernameWithGroupSuffix(),
                                 user.getPassword(),
                                 user.getRole().getName());
    }

    @Override
    public @NotNull @Unmodifiable Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(this.getRoleName().name()));
    }

    @Override
    public boolean isAccountNonExpired() {return true;}

    @Override
    public boolean isAccountNonLocked() {return true;}

    @Override
    public boolean isCredentialsNonExpired() {return true;}

    @Override
    public boolean isEnabled() {return true;}

    public String getUsernameWithoutGroupSuffix() {
        return GroupName.withoutGroupSuffix(this.getUsername());
    }
}
