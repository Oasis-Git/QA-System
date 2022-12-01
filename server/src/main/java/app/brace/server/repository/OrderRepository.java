package app.brace.server.repository;

import app.brace.server.model.Order;
import app.brace.server.model.Status;
import app.brace.server.model.StatusName;
import app.brace.server.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    Page<Order> findAllByQuestioner(User questioner, Pageable pageable);

    Page<Order> findAllByRespondent(User respondent, Pageable pageable);

    Page<Order> findAllByRespondentAndStatusNotIn(User respondent,
                                                  List<Status> status,
                                                  Pageable pageable);

    List<Order> findAllByRespondentUsernameOrderByCreatedAt(String username);

    Page<Order> findAllByStatusNameOrderByCreatedAt(StatusName statusName, Pageable pageable);

    Page<Order> findAllByIsPublicTrueAndStatusName(Pageable pageable, StatusName statusName);

    boolean existsByQuestionerUsername(String questioner);

    boolean existsByRespondentUsername(String respondent);

}
