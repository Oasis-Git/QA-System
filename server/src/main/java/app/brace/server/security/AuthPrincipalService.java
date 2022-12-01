package app.brace.server.security;

import app.brace.server.model.GroupName;
import app.brace.server.model.UserModel;
import app.brace.server.repository.AdminRepository;
import app.brace.server.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@AllArgsConstructor
@Service
public class AuthPrincipalService implements UserDetailsService {
    private final AdminRepository adminRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public AuthPrincipal loadUserByUsername(final @NotNull String usernameWithGroupSuffix)
            throws UsernameNotFoundException
    {
        final String username = GroupName.withoutGroupSuffix(usernameWithGroupSuffix);
        final UserModel user =
                (switch (GroupName.getGroupName(usernameWithGroupSuffix)) {
                    case GROUP_ADMIN -> this.adminRepository.findByUsername(username);
                    case GROUP_USER -> this.userRepository.findByUsername(username);
                }).orElseThrow(() -> new UsernameNotFoundException(usernameWithGroupSuffix));
        return AuthPrincipal.from(user);
    }
}
