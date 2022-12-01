package app.brace.server.repository;

import app.brace.server.model.ChatInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ChatInfoRepository extends JpaRepository<ChatInfo, UUID> {
}
