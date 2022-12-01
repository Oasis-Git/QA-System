package app.brace.server.repository;

import app.brace.server.model.AdminRole;
import app.brace.server.model.AdminRoleName;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.Arrays;
import java.util.function.Predicate;

@Repository
public interface AdminRoleRepository extends JpaRepository<AdminRole, AdminRoleName> {
    boolean existsByName(AdminRoleName roleName);

    AdminRole getByName(AdminRoleName roleName);
}

@AllArgsConstructor
@Component
class AdminRoleLoader {
    private final AdminRoleRepository repository;

    @PostConstruct
    private void load() {
        Arrays.stream(AdminRoleName.values())
              .filter(Predicate.not(this.repository::existsByName))
              .map(AdminRole::new)
              .forEach(this.repository::save);
    }
}
