package app.brace.server.repository;

import app.brace.server.model.UserRole;
import app.brace.server.model.UserRoleName;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.Arrays;
import java.util.function.Predicate;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UserRoleName> {
    boolean existsByName(UserRoleName roleName);

    UserRole getByName(UserRoleName roleName);
}

@AllArgsConstructor
@Component
class UserRoleLoader {
    private final UserRoleRepository repository;

    @PostConstruct
    private void load() {
        Arrays.stream(UserRoleName.values())
              .filter(Predicate.not(this.repository::existsByName))
              .map(UserRole::new)
              .forEach(this.repository::save);
    }
}
