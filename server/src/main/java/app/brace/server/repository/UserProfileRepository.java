package app.brace.server.repository;

import app.brace.server.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, String> {
    Optional<UserProfile> findByUsername(String username);

    UserProfile getByUsername(String username);

    boolean existsByEmail(String email);

    Optional<UserProfile> findByEmail(String email);
}
