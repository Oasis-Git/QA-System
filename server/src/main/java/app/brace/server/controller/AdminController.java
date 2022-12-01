package app.brace.server.controller;

import app.brace.server.exception.HandleableException;
import app.brace.server.iosocket.SocketIOServiceImpl;
import app.brace.server.model.*;
import app.brace.server.payload.ApiResponse;
import app.brace.server.repository.*;
import app.brace.server.security.AuthPrincipal;
import app.brace.server.security.JwtProvider;
import app.brace.server.security.PasswordEncoder;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.validation.Valid;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RolesAllowed("ADMIN")
@RequestMapping("/api/admin")
public class AdminController extends AuthController {
    private final PasswordEncoder passwordEncoder;

    private final AdminRepository adminRepository;
    private final AdminRoleRepository adminRoleRepository;

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final UserProfileRepository userProfileRepository;

    private final RespondentProfileRepository respondentProfileRepository;
    private final RespondentProfileStatusRepository respondentProfileStatusRepository;

    private final OrderRepository orderRepository;
    private final StatusRepository statusRepository;

    private final SettingsRepository settingsRepository;
    private final SocketIOServiceImpl socketIOServiceImpl;

    public AdminController(final PasswordEncoder passwordEncoder,
                           final AuthenticationManager authenticationManager,
                           final JwtProvider jwtProvider,
                           final AdminRepository adminRepository,
                           final AdminRoleRepository adminRoleRepository,
                           final UserRepository userRepository,
                           final UserRoleRepository userRoleRepository,
                           final UserProfileRepository userProfileRepository,
                           final RespondentProfileRepository respondentProfileRepository,
                           final RespondentProfileStatusRepository respondentProfileStatusRepository,
                           final OrderRepository orderRepository,
                           final StatusRepository statusRepository,
                           final SocketIOServiceImpl socketIOServiceImpl,
                           final SettingsRepository settingsRepository)
    {
        super(authenticationManager, jwtProvider);

        this.passwordEncoder = passwordEncoder;

        this.adminRepository = adminRepository;
        this.adminRoleRepository = adminRoleRepository;

        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.userProfileRepository = userProfileRepository;

        this.respondentProfileRepository = respondentProfileRepository;
        this.respondentProfileStatusRepository = respondentProfileStatusRepository;

        this.orderRepository = orderRepository;
        this.statusRepository = statusRepository;
        this.settingsRepository = settingsRepository;
        this.socketIOServiceImpl = socketIOServiceImpl;

    }

    @PermitAll
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>>
    login(@RequestBody final @Valid @NotNull AuthController.LoginRequest request)
    {
        return super.login(request, AdminRoleName.ROLE_ROOT);
    }

    @GetMapping("/isSuper")
    public ResponseEntity<ApiResponse<?>>
    getIsSuper(@AuthenticationPrincipal final @NotNull AuthPrincipal currentUser)
    {
        return super.getIsSuper(AdminRoleName.ROLE_ROOT, currentUser);
    }

    @GetMapping("/activated")
    public ResponseEntity<ApiResponse<?>>
    getActivated(@AuthenticationPrincipal final @NotNull AuthPrincipal currentUser)
    {
        final boolean activated =
                this.adminRepository.getByUsername(currentUser.getUsernameWithoutGroupSuffix())
                                    .isActivated();
        return ResponseEntity.ok(ApiResponse.success(Map.of("activated", activated)));
    }

    @Transactional(readOnly = true)
    @GetMapping("/admins/{username}")
    public ResponseEntity<ApiResponse<?>>
    getAdmin(@PathVariable final @NotNull String username,
             @AuthenticationPrincipal final @NotNull AuthPrincipal currentUser)
    {
        if (!this.adminRepository.existsByUsername(username)) {
            throw new HandleableException("管理员 `%s` 不存在。".formatted(username),
                                          null, AdminController.class)
                    .handle(HttpStatus.NOT_FOUND, AdminController.class);
        }
        if (!username.equals(currentUser.getUsernameWithoutGroupSuffix())
            && currentUser.getRoleName() != AdminRoleName.ROLE_ROOT)
        {
            throw new HandleableException("你无权查看管理员 `%s` 的信息".formatted(username),
                                          null, AdminController.class)
                    .handle(HttpStatus.FORBIDDEN, AdminController.class);
        }
        return ResponseEntity.ok(ApiResponse.success(this.adminRepository.getByUsername(username)));
    }

    @Transactional(readOnly = true)
    @GetMapping("/questions")
    public ResponseEntity<ApiResponse<?>>
    getQuestions(@RequestParam("status") final StatusName statusName, final Pageable pageable)
    {
        final Page<Map<String, ?>> orders = this.orderRepository
                .findAllByStatusNameOrderByCreatedAt(statusName, pageable)
                .map(order -> Map.of("id", order.getId(),
                                     "title", order.getTitle(),
                                     "questioner", order.getQuestioner().getUsername(),
                                     "respondent", order.getRespondent().getUsername(),
                                     "status", order.getStatus().getName(),
                                     "createdAt", order.getCreatedAt()));
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @Transactional(readOnly = true)
    @GetMapping("/questions/{id}")
    public ResponseEntity<ApiResponse<?>>
    getQuestion(@PathVariable final UUID id)
    {
        final Order order = this.orderRepository
                .findById(id)
                .orElseThrow(() -> new HandleableException(
                        "问题 `%s` 不存在。".formatted(id), null, AdminController.class)
                        .handle(HttpStatus.NOT_FOUND, AdminController.class)
                );
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("id", order.getId(),
                       "title", order.getTitle(),
                       "description", order.getDescription(),
                       "questioner", order.getQuestioner().getUsername(),
                       "respondent", order.getRespondent().getUsername(),
                       "status", order.getStatus().getName(),
                       "createdAt", order.getCreatedAt(),
                       "updatedAt", order.getUpdatedAt(),
                       "questionerAvatar", this.userProfileRepository.getByUsername(
                                                       order.getQuestioner().getUsername())
                                                                     .getAvatar(),
                       "respondentAvatar", this.userProfileRepository.getByUsername(
                                                       order.getRespondent().getUsername())
                                                                     .getAvatar())
        ));
    }

    @Transactional(readOnly = true)
    @GetMapping("/respondents")
    public ResponseEntity<ApiResponse<?>>
    getRespondents(final Pageable pageable)
    { // 目前仅考虑待审核的
        final Page<Map<String, ?>> respondents = this.respondentProfileRepository
                .findAllByStatusNameOrderByUpdatedAt(RespondentProfileStatusName.CENSORING,
                                                     pageable)
                .map(profile -> Map.of("username", profile.getUsername(),
                                       "description", profile.getDescription(),
                                       "fee", profile.getFee(),
                                       "updatedAt", profile.getUpdatedAt(),
                                       "avatar", this.userProfileRepository.getByUsername(
                                                             profile.getUsername())
                                                                           .getAvatar())
                );
        return ResponseEntity.ok(ApiResponse.success(respondents));
    }

    @Transactional(readOnly = true)
    @GetMapping("/respondents/{username}")
    public ResponseEntity<ApiResponse<?>>
    getRespondent(@PathVariable final String username)
    { // 考虑以后加入用户详情
        final RespondentProfile profile = this.respondentProfileRepository
                .findByUsername(username)
                .orElseThrow(() -> new HandleableException(
                        "回答者 `%s` 不存在。".formatted(username), null, AdminController.class)
                        .handle(HttpStatus.NOT_FOUND, AdminController.class)
                );
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("username", profile.getUsername(),
                       "specialities", profile.getSpecialities().stream()
                                              .map(Speciality::getValue),
                       "fee", profile.getFee(),
                       "description", profile.getDescription(),
                       "detail", profile.getDetail(),
                       "updatedAt", profile.getUpdatedAt(),
                       "avatar", this.userProfileRepository.getByUsername(
                                             profile.getUsername())
                                                           .getAvatar())
        ));
    }

    @Transactional
    @PutMapping("/questions/{id}/status")
    public ResponseEntity<ApiResponse<?>>
    putQuestionStatus(@PathVariable final UUID id,
                      @RequestBody final @NotNull PutQuestionStatusRequest request)
    {
        final Order order = this.orderRepository
                .findById(id)
                .orElseThrow(() -> new HandleableException(
                        "问题 `%s` 不存在。".formatted(id), null, AdminController.class)
                        .handle(HttpStatus.NOT_FOUND, AdminController.class)
                );
        order.setStatus(this.statusRepository.getByName(request.status()));
        if (order.getStatus() == this.statusRepository.getByName(StatusName.ACCEPTING)) {
            this.socketIOServiceImpl.PushCensorSuccessToUser(order.getQuestioner().getUsername(),
                                                             order.getRespondent().getUsername(),
                                                             order.getId());
        } else if (order.getStatus() == this.statusRepository.getByName(StatusName.FAILED)) {
            this.socketIOServiceImpl.PushCensorFailToUser(order.getQuestioner().getUsername(),
                                                          order.getId());
        }

        if (request.status == StatusName.ACCEPTING) {
            order.setCensoredAt(Instant.now());
        }
        return ResponseEntity.noContent().build();
    }

    @Transactional
    @PutMapping("/users/{username}/role")
    public ResponseEntity<ApiResponse<?>>
    putUserRole(@PathVariable final String username,
                @RequestBody final @NotNull PutUserRoleRequest request)
    {
        final User user = this.userRepository
                .findByUsername(username)
                .orElseThrow(() -> new HandleableException(
                        "用户 `%s` 不存在。".formatted(username), null, AdminController.class)
                        .handle(HttpStatus.NOT_FOUND, AdminController.class)
                );
        user.setRole(this.userRoleRepository.getByName(request.role()));
        return ResponseEntity.noContent().build();
    }

    @Transactional
    @PutMapping("/users/{username}/censor")
    public ResponseEntity<ApiResponse<?>>
    censorRespondent(@PathVariable final String username,
                     @RequestBody final @NotNull CensorRespondentRequest request)
    {
        final RespondentProfile profile = this.respondentProfileRepository
                .findByUsername(username)
                .orElseThrow(() -> new HandleableException(
                        "没有用户 `%s` 成为回答者的申请。".formatted(username), null, AdminController.class)
                        .handle(HttpStatus.BAD_REQUEST, AdminController.class)
                );
        final User user = this.userRepository.getByUsername(profile.getUsername());
        if (request.approved()) {
            profile.setStatus(this.respondentProfileStatusRepository.getByName(
                    RespondentProfileStatusName.APPROVED));
            user.setRole(this.userRoleRepository.getByName(UserRoleName.ROLE_RESPONDENT));
            this.socketIOServiceImpl.pushCensorRespondentSuccessToUser(username);
        } else {
            profile.setStatus(this.respondentProfileStatusRepository.getByName(
                    RespondentProfileStatusName.REJECTED));
            this.socketIOServiceImpl.pushCensorRespondentFailToUser(username);
        }
        return ResponseEntity.noContent().build();
    }

    @Transactional
    @PutMapping("/password")
    public ResponseEntity<ApiResponse<?>>
    putPassword(@RequestBody final @NotNull PutPasswordRequest request,
                @AuthenticationPrincipal final @NotNull AuthPrincipal currentUser)
    {
        final Admin admin = this.adminRepository.getByUsername(
                currentUser.getUsernameWithoutGroupSuffix());
        if (!this.passwordEncoder.matches(request.oldPassword(), admin.getPassword())) {
            throw new HandleableException("旧密码错误！", null, AdminController.class)
                    .handle(HttpStatus.BAD_REQUEST, AdminController.class);
        }
        admin.setPassword(this.passwordEncoder.encode(request.newPassword()));
        admin.setActivated(true);
        return ResponseEntity.noContent().build();
    }

    @Transactional
    @RolesAllowed("ROOT")
    @PostMapping("/addAdmin")
    public ResponseEntity<ApiResponse<?>>
    addAdmin(@RequestBody final @NotNull AddAdminRequest request)
    {
        final AdminRole role = this.adminRoleRepository.getByName(AdminRoleName.ROLE_ADMIN);
        final List<Map<String, String>> admins = new ArrayList<>();
        for (final String username : request.usernames()) {
            if (this.adminRepository.existsByUsername(username)) {
                admins.add(Map.of("username", username));
            } else {
                final String password = UUID.randomUUID().toString();
                this.adminRepository.save(new Admin(username,
                                                    this.passwordEncoder.encode(password),
                                                    role, false));
                admins.add(Map.of("username", username,
                                  "password", password));
            }
        }
        return ResponseEntity.created(linkTo(methodOn(AdminController.class)
                                                     .getAdmins(Pageable.unpaged()))
                                              .toUri())
                             .body(ApiResponse.success(Map.of("admins", admins)));
    }

    @Transactional(readOnly = true)
    @RolesAllowed("ROOT")
    @GetMapping("/admins")
    public ResponseEntity<ApiResponse<?>>
    getAdmins(final Pageable pageable)
    {
        final Page<Map<String, String>> admins =
                this.adminRepository.findAll(pageable)
                                    .map(admin -> Map.of("username", admin.getUsername(),
                                                         "role", admin.getRole().getName().name()));
        return ResponseEntity.ok(ApiResponse.success(admins));
    }

    @Transactional
    @GetMapping("/args")
    @RolesAllowed("ROOT")
    ResponseEntity<?>
    getArgs(@AuthenticationPrincipal final @NotNull AuthPrincipal currentUser)
    {
        Settings settings = settingsRepository.getSettingsByFake("setting");
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "timeout", Map.of(
                        "beforeAccept", settings.getBeforeAccept(),
                        "acceptToAnswer", settings.getAcceptToAnswer(),
                        "answerToChat", settings.getAnswerToChat(),
                        "chat", settings.getChat()
                ),
                "fee", settings.getMaxFee()
        )));
    }

    @Transactional
    @PutMapping("/args")
    @RolesAllowed("ROOT")
    ResponseEntity<?>
    putArgs(@RequestBody @NotNull PostForArgsChange request)
    {
        Settings settings = settingsRepository.getSettingsByFake("setting");
        settings.setMaxFee(request.fee);
        settings.setBeforeAccept(request.timeout.get("beforeAccept"));
        settings.setAcceptToAnswer(request.timeout.get("acceptToAnswer"));
        settings.setAnswerToChat(request.timeout.get("answerToChat"));
        settings.setChat(request.timeout.get("chat"));
        settingsRepository.save(settings);
        return ResponseEntity.noContent().build();
    }

    private static record PutQuestionStatusRequest(StatusName status) {
    }

    private static record PutUserRoleRequest(UserRoleName role) {
    }

    private static record CensorRespondentRequest(boolean approved) {
    }

    private static record PutPasswordRequest(String oldPassword, String newPassword) {
    }

    private static record AddAdminRequest(List<String> usernames) {
    }

    private static record PostForArgsChange(long fee, Map<String, String> timeout) {
    }
}
