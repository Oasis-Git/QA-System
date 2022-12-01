package app.brace.server.controller;

import app.brace.server.exception.HandleableException;
import app.brace.server.iosocket.SocketIOServiceImpl;
import app.brace.server.model.*;
import app.brace.server.payload.ApiResponse;
import app.brace.server.repository.*;
import app.brace.server.security.AuthPrincipal;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RolesAllowed("USER")
@RequestMapping("/api/qa")
public class QaController {
        RespondentProfileRepository respondentProfileRepository;
        OrderRepository orderRepository;
        StatusRepository statusRepository;
        UserRepository userRepository;
        UserProfileRepository userProfileRepository;
        ChatRepository chatRepository;
        RespondentProfileStatusRepository respondentProfileStatusRepository;
        SocketIOServiceImpl socketIOServiceImpl;

        public QaController(RespondentProfileRepository respondentProfileRepository, OrderRepository orderRepository,
                        StatusRepository statusRepository, UserRepository userRepository,
                        UserProfileRepository userProfileRepository, ChatRepository chatRepository,
                        RespondentProfileStatusRepository respondentProfileStatusRepository,
                        SocketIOServiceImpl socketIOServiceImpl) {
                this.respondentProfileRepository = respondentProfileRepository;
                this.orderRepository = orderRepository;
                this.statusRepository = statusRepository;
                this.userRepository = userRepository;
                this.userProfileRepository = userProfileRepository;
                this.chatRepository = chatRepository;
                this.respondentProfileStatusRepository = respondentProfileStatusRepository;
                this.socketIOServiceImpl = socketIOServiceImpl;
        }

        @Transactional(readOnly = true)
        @GetMapping("/respondents")
        @PermitAll
        public ResponseEntity<ApiResponse<?>> getRespondents(@RequestParam(name = "page") Integer page,
                        @RequestParam(name = "size") Integer size) {
                Pageable pageable = PageRequest.of(page, size);
                Page<RespondentProfile> respondentProfilesPage = respondentProfileRepository
                                .findAllByStatusNameOrderByUpdatedAt(RespondentProfileStatusName.APPROVED, pageable);
                return ResponseEntity.ok(ApiResponse.success(Map.of("respondents",
                                respondentProfilesPage.stream().map(respondentProfile -> Map.of("username",
                                                respondentProfile.getUsername(), "fee", respondentProfile.getFee(),
                                                "briefIntroduction", respondentProfile.getDescription(), "specialities",
                                                respondentProfile.getSpecialities().stream().map(Speciality::getValue),
                                                "pic",
                                                userProfileRepository.getByUsername(respondentProfile.getUsername())
                                                                .getAvatar()))
                                                .collect(Collectors.toList()),
                                "page", respondentProfilesPage.getTotalPages())));
        }

        @Transactional(readOnly = true)
        @GetMapping("/{username}/profile")
        public ResponseEntity<ApiResponse<?>> getRespondent(@PathVariable String username) {
                RespondentProfile respondentProfile = respondentProfileRepository.findByUsername(username)
                                .orElseThrow(() -> new HandleableException("用户名 `%s` 无法找到".formatted(username), null,
                                                RespondentProfileRepository.class).handle(HttpStatus.NOT_FOUND,
                                                                QaController.class));

                return ResponseEntity.ok(ApiResponse.success(Map.of("specialities",
                                respondentProfile.getSpecialities().stream().map(Speciality::getValue), "fee",
                                respondentProfile.getFee())));
        }

        @Transactional
        @PostMapping("/{id}/response")
        public ResponseEntity<ApiResponse<?>> postAnswerForFirst(@PathVariable UUID id,
                        @RequestBody AnswerBody answerBody,
                        @AuthenticationPrincipal final @NotNull AuthPrincipal currentUser) {
                Order order = orderRepository.findById(id)
                                .orElseThrow(() -> new HandleableException("订单 `%s` 无法找到".formatted(id.toString()),
                                                null, OrderRepository.class).handle(HttpStatus.NOT_FOUND,
                                                                QaController.class));

                if (!order.getRespondent().getUsername().equals(currentUser.getUsernameWithoutGroupSuffix())) {
                        throw new HandleableException(
                                        "这不是用户 `%s` 的订单".formatted(currentUser.getUsernameWithoutGroupSuffix()), null,
                                        QaController.class).handle(HttpStatus.BAD_REQUEST, QaController.class);
                }

                order.setFirstAnswer(answerBody.content);
                order.setStatus(statusRepository.getByName(StatusName.ANSWERED));
                order.setFirstAnswerAt(Instant.now());
                orderRepository.save(order);
                return ResponseEntity.ok(ApiResponse.success(null));
        }

        @Transactional
        @PostMapping("/{id}/accept")
        public ResponseEntity<ApiResponse<?>> acceptOrder(@PathVariable UUID id,
                        @AuthenticationPrincipal final @NotNull AuthPrincipal currentUser) {
                Order order = orderRepository.findById(id)
                                .orElseThrow(() -> new HandleableException("订单 `%s` 无法找到".formatted(id.toString()),
                                                null, OrderRepository.class).handle(HttpStatus.NOT_FOUND,
                                                                QaController.class));
                if (!order.getRespondent().getUsername().equals(currentUser.getUsernameWithoutGroupSuffix())) {
                        throw new HandleableException(
                                        "这不是用户 `%s` 的订单".formatted(currentUser.getUsernameWithoutGroupSuffix()), null,
                                        QaController.class).handle(HttpStatus.BAD_REQUEST, QaController.class);
                }

                order.setStatus(statusRepository
                                .getByName(order.getStatus().getName().getNextStatus(true).component1()));
                order.setAcceptedAt(Instant.now());
                orderRepository.save(order);
                socketIOServiceImpl.PushOrderAccept(order.getQuestioner().getUsername(), order.getId());
                return ResponseEntity.ok(ApiResponse.success("订单已被接收"));
        }

        @Transactional
        @PostMapping("/{id}/refuse")
        public ResponseEntity<ApiResponse<?>> refuseOrder(@PathVariable UUID id,
                        @AuthenticationPrincipal final @NotNull AuthPrincipal currentUser) {
                Order order = orderRepository.findById(id)
                                .orElseThrow(() -> new HandleableException("订单 `%s` 无法找到".formatted(id.toString()),
                                                null, OrderRepository.class).handle(HttpStatus.NOT_FOUND,
                                                                QaController.class));
                if (!order.getRespondent().getUsername().equals(currentUser.getUsernameWithoutGroupSuffix())) {
                        throw new HandleableException(
                                        "这不是用户 `%s` 的订单".formatted(currentUser.getUsernameWithoutGroupSuffix()), null,
                                        QaController.class).handle(HttpStatus.BAD_REQUEST, QaController.class);
                }

                order.setStatus(statusRepository
                                .getByName(order.getStatus().getName().getNextStatus(false).component1()));
                orderRepository.save(order);

                socketIOServiceImpl.PushOrderRefused(order.getQuestioner().getUsername(), order.getId());
                return ResponseEntity.ok(ApiResponse.success("订单已被拒绝"));
        }

        private static record AnswerBody(@NotBlank String content) {
        }

        @Transactional
        @PostMapping("/new-question")
        public ResponseEntity<ApiResponse<?>> postQuestion(
                        @RequestBody final @Valid @NotNull PostQuestionRequest request,
                        @AuthenticationPrincipal final @NotNull AuthPrincipal currentUser) {
                if (!userRepository.existsByUsername(request.respondent)) {
                        throw new HandleableException("用户 `%s` 不存在！".formatted(request.respondent), null,
                                        UserRepository.class).handle(HttpStatus.NOT_FOUND, QaController.class);
                }

                if (userRepository.getByUsername(request.respondent).getRole().getName() == UserRoleName.ROLE_USER) {
                        throw new HandleableException("用户 `%s` 不是回答者！".formatted(request.respondent), null,
                                        UserRepository.class).handle(HttpStatus.BAD_REQUEST, QaController.class);
                }

                UserProfile userProfile = userProfileRepository
                                .getByUsername(currentUser.getUsernameWithoutGroupSuffix());
                RespondentProfile respondentProfile = respondentProfileRepository.getByUsername(request.respondent);
                if (userProfile.getRemaining() < respondentProfile.getFee()) {
                        throw new HandleableException("您的余额不足！", null, QaController.class)
                                        .handle(HttpStatus.BAD_REQUEST, QaController.class);
                }

                final Order order = new Order(request.title, request.description,
                                this.userRepository.getByUsername(currentUser.getUsernameWithoutGroupSuffix()),
                                this.userRepository.getByUsername(request.respondent),
                                this.statusRepository.getByName(StatusName.CENSORING), request.isPublic,
                                respondentProfile.getFee());
                this.orderRepository.save(order);

                userProfileRepository.save(userProfile);

                return ResponseEntity.ok(ApiResponse.success(Map.of("id", order.getId())));
        }

        private static record PostQuestionRequest(@NotBlank String title, @NotBlank String respondent,
                        @NotBlank String description, @NotNull Boolean isPublic) {
        }

        @Transactional
        @GetMapping("/confirm/{respondentName}")
        public ResponseEntity<ApiResponse<?>> getQuestion(
                        @AuthenticationPrincipal final @NotNull AuthPrincipal currentUser,
                        @PathVariable String respondentName) {
                UserProfile userProfile = userProfileRepository.findByUsername(respondentName)
                                .orElseThrow(() -> new HandleableException("无法查找到回答者用户名 `%s`".formatted(respondentName),
                                                null, UserProfileRepository.class).handle(HttpStatus.NOT_FOUND,
                                                                QaController.class));
                RespondentProfile respondentProfile = respondentProfileRepository.findByUsername(respondentName)
                                .orElseThrow(() -> new HandleableException("用户 `%s` 不是回答者！".formatted(respondentName),
                                                null, RespondentProfileRepository.class).handle(HttpStatus.NOT_FOUND,
                                                                QaController.class));
                return ResponseEntity.ok(ApiResponse.success(Map.of("avatar", userProfile.getAvatar(), "specialties",
                                respondentProfile.getSpecialities().stream().map(Speciality::getValue), "fee",
                                respondentProfile.getFee())));
        }

        @Transactional
        @GetMapping("/{id}/question")
        public ResponseEntity<ApiResponse<?>> getQuestionContent(
                        @AuthenticationPrincipal final @NotNull AuthPrincipal currentUser, @PathVariable String id) {
                Order order = orderRepository.findById(UUID.fromString(id)).orElseThrow(
                                () -> new HandleableException("订单 `%s` 不存在！".formatted(id), null, OrderRepository.class)
                                                .handle(HttpStatus.NOT_FOUND, QaController.class));
                if (!order.getRespondent().getUsername().equals(currentUser.getUsernameWithoutGroupSuffix()) && !order
                                .getQuestioner().getUsername().equals(currentUser.getUsernameWithoutGroupSuffix())) {
                        throw new HandleableException(
                                        "这不是用户 `%s` 的订单".formatted(currentUser.getUsernameWithoutGroupSuffix()), null,
                                        QaController.class).handle(HttpStatus.BAD_REQUEST, QaController.class);
                }

                return ResponseEntity.ok(ApiResponse
                                .success(Map.of("title", order.getTitle(), "description", order.getDescription())));
        }

        @Transactional
        @GetMapping("/{id}/detail")
        public ResponseEntity<ApiResponse<?>> getQuestionDetail(
                        @AuthenticationPrincipal final @NotNull AuthPrincipal currentUser, @PathVariable String id) {
                Order order = orderRepository.findById(UUID.fromString(id)).orElseThrow(
                                () -> new HandleableException("订单 `%s` 不存在！".formatted(id), null, OrderRepository.class)
                                                .handle(HttpStatus.NOT_FOUND, QaController.class));
                if (!order.getRespondent().getUsername().equals(currentUser.getUsernameWithoutGroupSuffix()) && !order
                                .getQuestioner().getUsername().equals(currentUser.getUsernameWithoutGroupSuffix())) {
                        throw new HandleableException(
                                        "这不是用户 `%s` 的订单".formatted(currentUser.getUsernameWithoutGroupSuffix()), null,
                                        QaController.class).handle(HttpStatus.BAD_REQUEST, QaController.class);
                }
                return ResponseEntity.ok(ApiResponse.success(Map.of("title", order.getTitle(), "description",
                                order.getDescription(), "answer", order.getFirstAnswer())));
        }

        @Transactional
        @PostMapping("{id}/rate")
        public ResponseEntity<ApiResponse<?>> postRating(
                        @AuthenticationPrincipal final @NotNull AuthPrincipal currentUser, @PathVariable String id,
                        @RequestBody PostRating request) {
                Order order = orderRepository.getById(UUID.fromString(id));
                if (!order.getQuestioner().getUsername().equals(currentUser.getUsernameWithoutGroupSuffix())) {
                        throw new HandleableException(
                                        "这不是用户 `%s` 的订单".formatted(currentUser.getUsernameWithoutGroupSuffix()), null,
                                        QaController.class).handle(HttpStatus.BAD_REQUEST, QaController.class);
                }
                order.setRating(request.rating);
                orderRepository.save(order);
                RespondentProfile respondentProfile = respondentProfileRepository
                                .getByUsername(order.getRespondent().getUsername());
                respondentProfile.setRating(
                                (request.rating + respondentProfile.getTimes() * respondentProfile.getRating())
                                                / (respondentProfile.getTimes() + 1));
                respondentProfile.setTimes(respondentProfile.getTimes() + 1);
                respondentProfileRepository.save(respondentProfile);
                return ResponseEntity.ok(ApiResponse.success(null));
        }

        private static record PostRating(@NotBlank Float rating) {
        }

        @Transactional
        @PostMapping("{id}/finish")
        public ResponseEntity<ApiResponse<?>> postFinished(@PathVariable String id,
                        @AuthenticationPrincipal final @NotNull AuthPrincipal currentUser) {
                Order order = getOrder(id, currentUser);
                order.setStatus(statusRepository.getByName(StatusName.FINISHED));
                orderRepository.save(order);
                RespondentProfile respondentProfile = respondentProfileRepository
                                .getByUsername(order.getRespondent().getUsername());
                respondentProfile.setAnswerCounts(respondentProfile.getAnswerCounts() + 1);
                respondentProfile.setIncomes(respondentProfile.getIncomes() + order.getFee());
                respondentProfileRepository.save(respondentProfile);

                UserProfile userProfile = userProfileRepository.getByUsername(order.getRespondent().getUsername());
                userProfile.setRemaining(userProfile.getRemaining() + order.getFee());
                userProfileRepository.save(userProfile);

                UserProfile questioner = userProfileRepository.getByUsername(order.getQuestioner().getUsername());
                questioner.setExpenses(questioner.getExpenses() + order.getFee());
                questioner.setRemaining(questioner.getRemaining() - order.getFee());
                userProfileRepository.save(questioner);
                return ResponseEntity.ok(ApiResponse.success(null));
        }

        @Transactional
        @PostMapping("{id}/chat")
        public ResponseEntity<ApiResponse<?>> postChatBegin(@PathVariable String id,
                        @AuthenticationPrincipal final @NotNull AuthPrincipal currentUser) {
                Order order = getOrder(id, currentUser);
                order.setStatus(statusRepository.getByName(StatusName.CHATTING));
                order.setChatAt(Instant.now());
                Chat chat = new Chat(order);
                chatRepository.save(chat);
                orderRepository.save(order);
                return ResponseEntity.ok(ApiResponse.success(null));
        }

        private Order getOrder(String id, AuthPrincipal currentUser) {
                // TODO: Maybe Wrong!
                // TODO: IF Correct,Rebuild!
                Order order = orderRepository.findById(UUID.fromString(id)).orElseThrow(
                                () -> new HandleableException("订单 `%s` 不存在！".formatted(id), null, OrderRepository.class)
                                                .handle(HttpStatus.NOT_FOUND, QaController.class));
                if (!order.getQuestioner().getUsername().equals(currentUser.getUsernameWithoutGroupSuffix()) && !order
                                .getRespondent().getUsername().equals(currentUser.getUsernameWithoutGroupSuffix())) {
                        throw new HandleableException(
                                        ("这不是用户 `%s` 的订" + "单").formatted(currentUser.getUsernameWithoutGroupSuffix()),
                                        null, QaController.class).handle(HttpStatus.BAD_REQUEST, QaController.class);
                }
                return order;
        }

        @Transactional(readOnly = true)
        @PermitAll
        @GetMapping("/repo")
        public ResponseEntity<?> getQARepo(@RequestParam(name = "page") Integer page,
                        @RequestParam(name = "perPage") Integer size) {
                Pageable pageable = PageRequest.of(page, size);
                Page<Order> orders = orderRepository.findAllByIsPublicTrueAndStatusName(pageable, StatusName.FINISHED);
                return ResponseEntity.ok(ApiResponse.success(Map.of("questions", orders.stream()
                                .map(order -> Map.of("title", order.getTitle(), "description", order.getDescription(),
                                                "id", order.getId(), "answer", order.getFirstAnswer()))
                                .collect(Collectors.toList()), "page", orders.getTotalPages())));
        }

        @Transactional(readOnly = true)
        @GetMapping("/{id}/status")
        public ResponseEntity<?> getOrderStatus(@PathVariable String id,
                        @AuthenticationPrincipal final @NotNull AuthPrincipal currentUser) {
                return ResponseEntity.ok(ApiResponse
                                .success(Map.of("status", orderRepository.getById(UUID.fromString(id)).getStatus())));
        }

        @Transactional(readOnly = true)
        @GetMapping("{id}/public/detail")
        public ResponseEntity<?> getPublicOrder(@PathVariable String id,
                                                @AuthenticationPrincipal final @NotNull AuthPrincipal currentUser){
                Order order= orderRepository.getById(UUID.fromString(id));
                return ResponseEntity.ok(ApiResponse.success(Map.of(
                        "title",order.getTitle(),
                        "description", order.getDescription(),
                        "answer", order.getFirstAnswer()
                )));
        }
}
