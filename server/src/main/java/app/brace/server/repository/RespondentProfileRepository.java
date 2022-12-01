package app.brace.server.repository;

import app.brace.server.model.RespondentProfile;
import app.brace.server.model.RespondentProfileStatusName;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RespondentProfileRepository extends JpaRepository<RespondentProfile, UUID> {
    Optional<RespondentProfile> findByUsername(String username);

    Page<RespondentProfile> findAllByStatusNameOrderByUpdatedAt(RespondentProfileStatusName name,
                                                                Pageable pageable);

    RespondentProfile getByUsername(String username);

    boolean existsByUsername(String username);
}
