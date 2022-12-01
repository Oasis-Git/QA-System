package app.brace.server.repository;

import app.brace.server.model.RespondentProfileStatus;
import app.brace.server.model.RespondentProfileStatusName;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.Arrays;
import java.util.function.Predicate;

@Repository
public interface RespondentProfileStatusRepository
        extends JpaRepository<RespondentProfileStatus, RespondentProfileStatusName>
{
    RespondentProfileStatus getByName(RespondentProfileStatusName name);

    boolean existsByName(RespondentProfileStatusName name);
}

@AllArgsConstructor
@Component
class RespondentProfileStatusLoader {
    private final RespondentProfileStatusRepository repository;

    @PostConstruct
    private void load() {
        Arrays.stream(RespondentProfileStatusName.values())
              .filter(Predicate.not(this.repository::existsByName))
              .map(RespondentProfileStatus::new)
              .forEach(this.repository::save);
    }
}
