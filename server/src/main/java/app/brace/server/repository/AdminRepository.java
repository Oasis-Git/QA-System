package app.brace.server.repository;

import app.brace.server.model.Admin;
import app.brace.server.model.AdminRoleName;
import app.brace.server.security.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.DependsOn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {
    Admin getByUsername(String username);

    Optional<Admin> findByUsername(String username);

    boolean existsByUsername(String username);
}

@RequiredArgsConstructor
@Component
@DependsOn("adminRoleLoader")
class AdminLoader {
    private final AdminRepository adminRepository;
    private final AdminRoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    @Value("${admin.root-username}")
    private String rootUsername;

    @Value("${admin.root-password}")
    private String rootPassword;

    @PostConstruct
    private void load() {
        if (!this.adminRepository.existsByUsername(this.rootUsername)) {
            this.adminRepository.save(
                    new Admin(this.rootUsername, this.passwordEncoder.encode(this.rootPassword),
                              this.roleRepository.getByName(AdminRoleName.ROLE_ROOT), true)
            );
        }
    }
}
