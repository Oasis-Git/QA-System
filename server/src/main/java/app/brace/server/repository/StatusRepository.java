package app.brace.server.repository;

import app.brace.server.model.Status;
import app.brace.server.model.StatusName;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.Arrays;
import java.util.function.Predicate;

@Repository
public interface StatusRepository extends JpaRepository<Status, StatusName> {
    Status getByName(StatusName statusName);
    boolean existsByName(StatusName statusName);
}

@AllArgsConstructor
@Component
class StatusLoader {
    private final StatusRepository repository;

    @PostConstruct
    private void load() {
        Arrays.stream(StatusName.values())
              .filter(Predicate.not(this.repository::existsByName))
              .map(Status::new)
              .forEach(this.repository::save);
    }
}
