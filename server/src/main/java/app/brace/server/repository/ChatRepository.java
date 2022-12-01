package app.brace.server.repository;

import app.brace.server.model.Chat;
import app.brace.server.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatRepository extends JpaRepository<Chat, UUID> {
    Chat getByOrder(Order order);

    Optional<Chat> findByOrder(Order order);
}
