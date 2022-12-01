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
import org.springframework.data.domain.PageRequest;
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
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RolesAllowed("USER")
@RequestMapping("/api/user")
public class UserController extends AuthController {
    private final PasswordEncoder passwordEncoder;
    private final OrderRepository orderRepository;
    private final StatusRepository statusRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserRoleRepository userRoleRepository;
    private final RespondentProfileRepository respondentProfileRepository;
    private final RespondentProfileStatusRepository respondentProfileStatusRepository;
    private final SpecialityRepository specialityRepository;
    private final SocketIOServiceImpl socketIOServiceImpl;
    private final ChatRepository chatRepository;
    private final SettingsRepository settingsRepository;

    public UserController(final AuthenticationManager authenticationManager,
                          final JwtProvider jwtProvider,
                          final PasswordEncoder passwordEncoder,
                          final UserRepository userRepository,
                          final UserProfileRepository userProfileRepository,
                          final OrderRepository orderRepository,
                          final StatusRepository statusRepository,
                          final UserRoleRepository userRoleRepository,
                          final RespondentProfileRepository respondentProfileRepository,
                          final RespondentProfileStatusRepository respondentProfileStatusRepository,
                          final SpecialityRepository specialityRepository,
                          final SocketIOServiceImpl socketIOServiceImpl,
                          final ChatRepository chatRepository,
                          final SettingsRepository settingsRepository)
    {
        super(authenticationManager, jwtProvider);
        this.passwordEncoder = passwordEncoder;
        this.orderRepository = orderRepository;
        this.statusRepository = statusRepository;
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.userRoleRepository = userRoleRepository;
        this.respondentProfileRepository = respondentProfileRepository;
        this.respondentProfileStatusRepository = respondentProfileStatusRepository;
        this.specialityRepository = specialityRepository;
        this.socketIOServiceImpl = socketIOServiceImpl;
        this.chatRepository = chatRepository;
        this.settingsRepository = settingsRepository;
    }

    @PermitAll
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>>
    login(@RequestBody final @Valid @NotNull AuthController.LoginRequest request)
    {
        return super.login(request, UserRoleName.ROLE_RESPONDENT);
    }

    @GetMapping("/isSuper")
    public ResponseEntity<ApiResponse<?>>
    getIsSuper(@AuthenticationPrincipal final @NotNull AuthPrincipal currentUser) {
        return super.getIsSuper(UserRoleName.ROLE_RESPONDENT, currentUser);
    }

    @Transactional
    @PermitAll
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<?>>
    register(@RequestBody final @Valid @NotNull SignupRequest request)
    {
        if (this.userRepository.existsByUsername(request.username())) {
            throw new HandleableException("用户名 `%s` 已存在。".formatted(request.username()),
                                          null, UserController.class)
                    .handle(HttpStatus.BAD_REQUEST, UserController.class);
        }
        if (this.userProfileRepository.existsByEmail(request.email())) {
            throw new HandleableException("邮箱 `%s` 已存在。".formatted(request.email()),
                                          null, UserController.class)
                    .handle(HttpStatus.BAD_REQUEST, UserController.class);
        }
        final User user = this.userRepository.save(
                new User(request.username(),
                         this.passwordEncoder.encode(request.password()),
                         this.userRoleRepository.getByName(UserRoleName.ROLE_USER))
        );
        this.userProfileRepository.save(new UserProfile(user, request.email(), "/blank_avatar.png"));
        return ResponseEntity.created(linkTo(methodOn(UserController.class)
                                                     .getProfile(user.getUsername(),
                                                                 AuthPrincipal.from(user)))
                                              .toUri())
                             .body(ApiResponse.success(null));
    }

    @Transactional(readOnly = true)
    @GetMapping("/{username}/profile")
    public ResponseEntity<ApiResponse<?>>
    getProfile(@PathVariable final @NotNull String username,
               @AuthenticationPrincipal final @NotNull AuthPrincipal currentUser)
    {
        final UserProfile profile = this.userProfileRepository.findByUsername(username).orElseThrow(
                () -> new HandleableException("无法查找到提问者用户名 `%s`".formatted(username),
                                              null, UserRepository.class).handle(
                        HttpStatus.NOT_FOUND, UserController.class));

        if (profile.getUser().getRole().getName() == UserRoleName.ROLE_RESPONDENT) {
            final RespondentProfile respondentProfile = this.respondentProfileRepository
                    .findByUsername(username)
                    .orElseThrow(() -> new HandleableException(
                            "该用户 `%s` 未成为提问者".formatted(username),
                            null, RespondentProfileRepository.class
                    ).handle(HttpStatus.INTERNAL_SERVER_ERROR, UserController.class));

            List<?> orderInfoList=orderRepository.findAllByRespondentUsernameOrderByCreatedAt(username)
                                                 .stream().filter(order -> order.getFirstAnswer()!=null).map(
                            order -> Map.of(
                                    "title",order.getTitle(),
                                    "answeredAt",order.getFirstAnswerAt()
                            )
                    ).collect(Collectors.toList());

            if(orderInfoList.size() > 10) {
                orderInfoList = orderInfoList.subList(0, 10);
            }

            return ResponseEntity.ok(ApiResponse.success(Map.of(
                    "username", profile.getUsername(),
                    "email", profile.getEmail(),
                    "location", profile.getLocation(),
                    "contacts", Map.of("wechat", profile.getWechat(),
                                       "weibo", profile.getWeibo()),
                    "avatar", profile.getAvatar(),
                    "respondentProfile", Map.of(
                            "description", respondentProfile.getDescription(),
                            "specialities", respondentProfile.getSpecialities().stream()
                                                             .map(Speciality::getValue),
                            "rating", respondentProfile.getRating(),
                            "answerCount", respondentProfile.getAnswerCounts(),
                            "pinnedAnswers", orderInfoList,
                            "fee", respondentProfile.getFee(),
                            "detail", respondentProfile.getDetail()
                    )
            )));
        }

        if (!username.equals(currentUser.getUsernameWithoutGroupSuffix())) {
            throw new HandleableException("你无权查看用户 `%s` 的信息".formatted(username),
                                          null, UserController.class)
                    .handle(HttpStatus.FORBIDDEN, UserController.class);
        }
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "username", profile.getUsername(),
                "email", profile.getEmail(),
                "location", profile.getLocation(),
                "contacts", Map.of("wechat", profile.getWechat(),
                                   "weibo", profile.getWeibo()),
                "avatar", profile.getAvatar()
        )));
    }

    @Transactional(readOnly = true)
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<?>>
    getUserOrders(@RequestParam(name = "page") final Integer page, @RequestParam(name =
            "perpage") final Integer size,
                  @AuthenticationPrincipal final @NotNull AuthPrincipal currentUser)
    {
        final Pageable pageable = PageRequest.of(page, size);
        final Page<Order> orders = this.orderRepository.findAllByQuestioner(
                this.userRepository.findByUsername(currentUser.getUsernameWithoutGroupSuffix())
                                   .orElseThrow(() -> new HandleableException(
                                           "无法查找到用户 `%s`".formatted(
                                                   currentUser.getUsernameWithoutGroupSuffix()),
                                           null, UserRepository.class)
                                           .handle(HttpStatus.NOT_FOUND, UserController.class)),
                pageable);
        return getApiResponseResponseEntity(orders);
    }


    @Transactional(readOnly = true)
    @GetMapping("/questions")
    public ResponseEntity<ApiResponse<?>>
    getUserQuestions(@RequestParam(name = "page") final Integer page,
                     @RequestParam(name = "perpage") final Integer size,
                     @AuthenticationPrincipal final @NotNull AuthPrincipal currentUser)
    {
        final Pageable pageable = PageRequest.of(page, size);
        final Page<Order> orders = this.orderRepository.findAllByRespondentAndStatusNotIn(
                this.userRepository.getByUsername(currentUser.getUsernameWithoutGroupSuffix()),
                List.of(statusRepository.getByName(StatusName.CENSORING),
                        statusRepository.getByName(StatusName.EDITING)),
                pageable);
        if (userRepository.getByUsername(currentUser.getUsernameWithoutGroupSuffix())
                          .getRole().getName() == UserRoleName.ROLE_USER) {
            throw new HandleableException(
                    "用户 `%s` 不是回答者！".formatted(currentUser.getUsernameWithoutGroupSuffix()),
                    null, UserController.class)
                    .handle(HttpStatus.FORBIDDEN, UserController.class);
        }
        return getApiResponseResponseEntity(orders);
    }

    @NotNull
    private ResponseEntity<ApiResponse<?>> getApiResponseResponseEntity(Page<Order> orders) {
        Settings settings = settingsRepository.getSettingsByFake("setting");
        List<Duration> durations=List.of(Duration.parse(settings.getBeforeAccept()), Duration.parse(settings.getAcceptToAnswer()),
                Duration.parse(settings.getAnswerToChat()), Duration.parse(settings.getChat()));
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("questions", orders.getContent().stream().map(
                                order -> {
                                    Duration timeout = order.getStatus().getName()== StatusName.ACCEPTING ? durations.get(0).minus(Duration.between(order.getCensoredAt(), Instant.now())):(
                                            order.getStatus().getName()==StatusName.ANSWERING ? durations.get(1).minus(Duration.between(order.getAcceptedAt(),Instant.now())): (
                                                    order.getStatus().getName() == StatusName.ANSWERED ? durations.get(2).minus(Duration.between(order.getFirstAnswerAt(),Instant.now())):(
                                                            order.getStatus().getName() == StatusName.CHATTING ? durations.get(3).minus(Duration.between(order.getChatAt(),Instant.now())) : (
                                                                    order.getFirstAnswer() == null ? Duration.ofMinutes(114514) : Duration.ofMinutes(0) // fucking magic number...
                                                            )
                                                    )
                                            )
                                    );

                                    if(timeout.isNegative()){
                                        if (order.getFirstAnswer() == null) {
                                            order.setFirstAnswer("");
                                        }
                                        order.setStatus(statusRepository.getByName(StatusName.FAILED));
                                        orderRepository.save(order);
                                    }

                                    return Map.of("id", order.getId(),
                                            "title", order.getTitle(),
                                            "respondent", order.getRespondent().getUsername(),
                                            "questioner", order.getQuestioner().getUsername(),
                                            "timeout", timeout ,
                                            "status", order.getStatus());
                                }
                        ), "count", orders.getTotalElements()
                )
        ));
    }


    @Transactional(readOnly = true)
    @GetMapping("/navbar")
    public ResponseEntity<ApiResponse<?>>
    getInfoNavBar(@AuthenticationPrincipal final @NotNull AuthPrincipal currentUser)
    {
        final UserProfile userProfile =
                this.userProfileRepository
                        .findByUsername(currentUser.getUsernameWithoutGroupSuffix())
                        .orElseThrow(
                                () -> new HandleableException(
                                        "无法查找到用户名 `%s`".formatted(
                                                currentUser.getUsernameWithoutGroupSuffix()),
                                        null, UserRepository.class).handle(
                                        HttpStatus.NOT_FOUND, UserController.class));
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("username", userProfile.getUsername(),
                       "email", userProfile.getEmail(),
                       "avatar", userProfile.getAvatar())
        ));
    }

    @Transactional(readOnly = true)
    @GetMapping("/sidebar")
    public ResponseEntity<ApiResponse<?>>
    getInfoSideBar(@AuthenticationPrincipal final @NotNull AuthPrincipal currentUser)
    {
        final UserProfile userProfile =
                this.userProfileRepository
                        .findByUsername(currentUser.getUsernameWithoutGroupSuffix())
                        .orElseThrow(
                                () -> new HandleableException(
                                        "无法查找到用户名 `%s`".formatted(
                                                currentUser.getUsernameWithoutGroupSuffix()),
                                        null, UserRepository.class).handle(
                                        HttpStatus.NOT_FOUND, UserController.class));
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("username", userProfile.getUsername(),
                       "identity",
                       (userProfile.getUser().getRole().getName().equals(UserRoleName.ROLE_USER) ?
                               "用户" : "回答者"))
        ));
    }

    private static record SignupRequest(
            @NotBlank @Size(max = 20) String username,
            @NotBlank @Size(max = 50) @Email String email,
            @NotBlank @Size(max = 20) String password)
    {}


    @Transactional
    @PostMapping("/apply")
    public ResponseEntity<?>
    getRespondentProfile(@AuthenticationPrincipal final @NotNull AuthPrincipal currentUser,
                         @RequestBody final @Valid @NotNull PostRespondentRequest request)
    {
        List<Speciality> preparedSpeciality = new ArrayList<>();
        for (String speciality : request.specialities) {
            if (!specialityRepository.existsByValue(speciality)) {
                specialityRepository.save(new Speciality(speciality));
            }
            preparedSpeciality.add(specialityRepository.getSpecialityByValue(speciality));
        }
        final RespondentProfileStatus status = this.respondentProfileStatusRepository.getByName(
                RespondentProfileStatusName.CENSORING);
        respondentProfileRepository.save(new RespondentProfile(
                userRepository.findByUsername(currentUser.getUsernameWithoutGroupSuffix())
                        .orElseThrow(() -> new HandleableException(
                                "无法查找到用户名 `%s`".formatted(currentUser.getUsernameWithoutGroupSuffix()),
                                null, UserRepository.class).handle(
                                HttpStatus.INTERNAL_SERVER_ERROR, UserController.class)),
                preparedSpeciality,
                request.fee,
                request.description,
                request.detail,
                status
        ));
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    private static record PostRespondentRequest(
            @NotEmpty List<String> specialities,
            long fee,
            @NotBlank String description,
            @NotBlank String detail)
    {}

    @Transactional
    @PostMapping("/settings/basic")
    public ResponseEntity<?>
    postInfoChange(@AuthenticationPrincipal final @NotNull AuthPrincipal currentUser,
                         @RequestBody final @Valid @NotNull PostInfoChangeRequest request)
    {
        UserProfile userProfile=userProfileRepository.getByUsername(currentUser.getUsernameWithoutGroupSuffix());
        userProfile.setAvatar(request.avatar);
        userProfile.setLocation(request.location);
        userProfile.setWechat(request.wechat);
        userProfile.setWeibo(request.weibo);
        userProfileRepository.save(userProfile);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @Transactional
    @GetMapping("/settings/basic")
    public ResponseEntity<?>
    getInfoNow(@AuthenticationPrincipal final @NotNull AuthPrincipal currentUser){
        UserProfile userProfile=userProfileRepository.getByUsername(currentUser.getUsernameWithoutGroupSuffix());
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "wechat",userProfile.getWechat(),
                "weibo",userProfile.getWeibo(),
                "avatar",userProfile.getAvatar(),
                "location",userProfile.getLocation()
        )));
    }

    private static record PostInfoChangeRequest(
            @NotBlank String weibo,
            @NotBlank String location,
            @NotBlank String wechat,
            @NotBlank String avatar)
    {}

    @Transactional(readOnly = true)
    @GetMapping("/dashboard/banking/expense")
    public ResponseEntity<?>
    getExpense(@AuthenticationPrincipal final @NotNull AuthPrincipal currentUser){
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                    "expense",userProfileRepository.getByUsername(currentUser.getUsernameWithoutGroupSuffix())
                        .getExpenses(),
                    "balance",userProfileRepository.getByUsername(currentUser.getUsernameWithoutGroupSuffix())
                        .getRemaining()
                )
        ));
    }

    @Transactional(readOnly = true)
    @GetMapping("/dashboard/banking/income")
    public ResponseEntity<?>
    getIncome(@AuthenticationPrincipal final @NotNull AuthPrincipal currentUser){
        if(userRepository.getByUsername(currentUser.getUsernameWithoutGroupSuffix())
                .getRole().getName()==UserRoleName.ROLE_USER){
            throw new HandleableException(
                    "用户 `%s` 不是回答者！".formatted(currentUser.getUsernameWithoutGroupSuffix()),
                    null, UserRepository.class).handle(
                    HttpStatus.NOT_FOUND, RespondentProfileRepository.class);
        }
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                        "income",respondentProfileRepository.getByUsername(currentUser.getUsernameWithoutGroupSuffix())
                                .getIncomes(),
                        "balance",userProfileRepository.getByUsername(currentUser.getUsernameWithoutGroupSuffix())
                                .getRemaining()
                )
        ));
    }

    @Transactional
    @PostMapping("/settings/password")
    public ResponseEntity<?>
    changePassword(@AuthenticationPrincipal final @NotNull AuthPrincipal currentUser,
                   @RequestBody PostForPasswordChange request){
        User user=userRepository.getByUsername(currentUser.getUsernameWithoutGroupSuffix());
        if(!this.passwordEncoder.matches(request.oldPassword(), user.getPassword())){
            throw new HandleableException("原有密码输入错误！",
                                          null, UserRepository.class).handle(
                    HttpStatus.BAD_REQUEST, UserController.class);
        }
        user.setPassword(this.passwordEncoder.encode(request.newPassword));
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    private static record PostForPasswordChange(
            @NotBlank String newPassword,
            @NotBlank String oldPassword)
    {}

    @Transactional
    @PostMapping("/banking/deposit")
    public ResponseEntity<?>
    deposit(@AuthenticationPrincipal final @NotNull AuthPrincipal currentUser,
            @RequestBody PostForDeposit request){
        UserProfile userProfile=this.userProfileRepository.getByUsername(currentUser.getUsernameWithoutGroupSuffix());
        userProfile.setRemaining(userProfile.getRemaining()+request.amount);
        userProfileRepository.save(userProfile);
        return ResponseEntity.ok(ApiResponse.success("充值成功！"));
    }

    private static record PostForDeposit(
            @NotBlank Integer amount)
    {}

    @Transactional
    @PermitAll
    @PostMapping("/resetPassword/validateEmail")
    public ResponseEntity<?>
    deposit(@RequestBody PostForUsernameByEmail request){
        UserProfile userProfile=userProfileRepository.findByEmail(request.email).orElseThrow(
                ()->new HandleableException("无法通过邮箱查找到相应用户！",
                        null, UserProfileRepository.class).handle(
                        HttpStatus.BAD_REQUEST, UserController.class)
        );
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "username",userProfile.getUsername()
        )));
    }

    private static record PostForUsernameByEmail(
            @NotBlank String email
    ){}


    private static record PostForResetPassword(
            @NotBlank String username,
            @NotBlank String password)
    {}

    @Transactional
    @PermitAll
    @PostMapping("/resetPassword")
    public ResponseEntity<?>
    resetPassword(@RequestBody PostForResetPassword request){
        User user=userRepository.getByUsername(request.username);
        user.setPassword(this.passwordEncoder.encode(request.password));
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("已重设密码！"));
    }

    @Transactional(readOnly = true)
    @GetMapping("/chat/{id}/role")
    public ResponseEntity<?>
    getRoleInChat(@AuthenticationPrincipal final @NotNull AuthPrincipal currentUser, @PathVariable String id) {
        Order order = orderRepository.findById(UUID.fromString(id)).orElseThrow(
                () -> new HandleableException("无法查找到订单号为`%s`的订单！".formatted(id),
                                              null, OrderRepository.class).handle(
                        HttpStatus.NOT_FOUND, UserController.class)
        );
        if (order.getRespondent().getUsername().equals(currentUser.getUsernameWithoutGroupSuffix())) {
            return ResponseEntity.ok(ApiResponse.success("respondent"));
        }
        if (order.getQuestioner().getUsername().equals(currentUser.getUsernameWithoutGroupSuffix())) {
            return ResponseEntity.ok(ApiResponse.success("questioner"));
        }
        throw new HandleableException("订单`%s`与你无关！".formatted(id),
                                      null, OrderRepository.class).handle(
                HttpStatus.BAD_REQUEST, UserController.class);
    }

    @Transactional(readOnly = true)
    @GetMapping("/chat/{id}/respondent")
    public ResponseEntity<?>
    getRespondentInfoInChat(@AuthenticationPrincipal final @NotNull AuthPrincipal currentUser, @PathVariable String id) {
        Order order = orderRepository.findById(UUID.fromString(id)).orElseThrow(
                () -> new HandleableException("无法查找到订单号为`%s`的订单！".formatted(id),
                                              null, OrderRepository.class).handle(
                        HttpStatus.NOT_FOUND, UserController.class)
        );

        UserProfile userProfile = userProfileRepository.getByUsername(order.getRespondent().getUsername());
        RespondentProfile respondentProfile = respondentProfileRepository.getByUsername(order.getRespondent().getUsername());
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "username", userProfile.getUsername(),
                "description", respondentProfile.getDescription(),
                "avatar", userProfile.getAvatar(),
                "wechat", userProfile.getWechat(),
                "weibo", userProfile.getWeibo(),
                "email", userProfile.getEmail(),
                "specialities", respondentProfile.getSpecialities().stream().map(Speciality::getValue),
                "isOnline", socketIOServiceImpl.ifOnline(userProfile.getUsername())
        )));
    }

    @Transactional(readOnly = true)
    @GetMapping("/chat/{id}/questioner")
    public ResponseEntity<?>
    getQuestionerInfoInChat(@AuthenticationPrincipal final @NotNull AuthPrincipal currentUser,
                            @PathVariable String id)
    {
        Order order = orderRepository.findById(UUID.fromString(id)).orElseThrow(
                () -> new HandleableException("无法查找到订单号为`%s`的订单！".formatted(id),
                                              null, OrderRepository.class).handle(
                        HttpStatus.NOT_FOUND, UserController.class)
        );

        UserProfile userProfile = userProfileRepository.getByUsername(order.getQuestioner().getUsername());
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "username", userProfile.getUsername(),
                "avatar", userProfile.getAvatar(),
                "email", userProfile.getEmail(),
                "isOnline", socketIOServiceImpl.ifOnline(userProfile.getUsername())
        )));
    }

    @Transactional(readOnly = true)
    @GetMapping("/chat/{id}/question")
    public ResponseEntity<?>
    getOrderInfoInChat(@AuthenticationPrincipal final @NotNull AuthPrincipal currentUser, @PathVariable String id) {
        Order order = orderRepository.findById(UUID.fromString(id)).orElseThrow(
                () -> new HandleableException("无法查找到订单号为`%s`的订单！".formatted(id),
                                              null, OrderRepository.class).handle(
                        HttpStatus.NOT_FOUND, UserController.class)
        );
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "title", order.getTitle(),
                "description", order.getDescription(),
                "answer", order.getFirstAnswer()
        )));
    }

    @Transactional(readOnly = true)
    @GetMapping("/chat/{id}/message")
    public ResponseEntity<?>
    getChatInfo(@AuthenticationPrincipal final @NotNull AuthPrincipal currentUser, @PathVariable String id) {
        Order order = orderRepository.findById(UUID.fromString(id)).orElseThrow(
                () -> new HandleableException("无法查找到订单号为`%s`的订单！".formatted(id),
                                              null, OrderRepository.class).handle(
                        HttpStatus.NOT_FOUND, UserController.class)
        );
        Chat chat = chatRepository.findByOrder(order).orElseThrow(
                () -> new HandleableException("订单号为`%s`的订单没有聊天！".formatted(id),
                                              null, OrderRepository.class).handle(
                        HttpStatus.NOT_FOUND, UserController.class)
        );
        return ResponseEntity.ok(ApiResponse.success(
                chat.getChatInfoList().stream().map(
                        chatInfo -> Map.of(
                                "messageType", chatInfo.getType(),
                                "content", chatInfo.getInfo(),
                                "isMe", chatInfo.getSayer().equals(currentUser.getUsernameWithoutGroupSuffix()),
                                "timestamp", chatInfo.getPostTime()
                        )
                ).collect(Collectors.toList())
        ));
    }

    @Transactional
    @PostMapping("/settings/respondent")
    public ResponseEntity<?>
    changeInfoInSetting(@AuthenticationPrincipal final @NotNull AuthPrincipal currentUser, @RequestBody final PostForInfoChangeInSetting request){
        RespondentProfile respondentProfile=respondentProfileRepository.getByUsername(currentUser.getUsernameWithoutGroupSuffix());
        respondentProfile.setFee(request.fee);
        respondentProfile.setDescription(request.about);
        respondentProfile.setDetail(request.detail);
        for(String specialty: request.specialities){
            if(!specialityRepository.existsByValue(specialty)){
                specialityRepository.save(new Speciality(specialty));
            }
        }
        respondentProfile.setSpecialities(request.specialities.stream().map(specialityRepository::getSpecialityByValue).collect(Collectors.toList()));
        respondentProfile.setStatus(this.respondentProfileStatusRepository.getByName(RespondentProfileStatusName.CENSORING));
        respondentProfileRepository.save(respondentProfile);
        return ResponseEntity.ok(ApiResponse.success(true));
    }

    private static record PostForInfoChangeInSetting(
            @NotEmpty List<String> specialities,
            @NotNull Long fee,
            @NotBlank String about,
            @NotBlank String detail
    ){}

    @Transactional
    @GetMapping("/settings/respondent")
    public ResponseEntity<?>
    getInfoChange(@AuthenticationPrincipal final @NotNull AuthPrincipal currentUser){
        RespondentProfile respondentProfile =respondentProfileRepository.getByUsername(currentUser.getUsernameWithoutGroupSuffix());
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "specialities", respondentProfile.getSpecialities().stream().map(Speciality::getValue).collect(Collectors.toList()),
                "fee",respondentProfile.getFee(),
                "about",respondentProfile.getDescription(),
                "detail",respondentProfile.getDetail()
        )));
    }

    @Transactional(readOnly = true)
    @GetMapping("dashboard/calendar")
    public ResponseEntity<?>
    getCalendarInfo(@AuthenticationPrincipal final @NotNull AuthPrincipal currentUser){
        List<Order> orders= orderRepository.findAllByRespondentUsernameOrderByCreatedAt(currentUser.getUsernameWithoutGroupSuffix());
        Settings settings= settingsRepository.getSettingsByFake("setting");
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("events",orders.stream().map(
                        order -> Map.of(
                                "id",order.getId(),
                                "title",order.getTitle(),
                                "status",order.getStatus(),
                                "deadline",order.getStatus().getName()==StatusName.ACCEPTING ? order.getCensoredAt().plus(Duration.parse(settings.getBeforeAccept())):(
                                        order.getStatus().getName()==StatusName.ANSWERING ? order.getAcceptedAt().plus(Duration.parse(settings.getAcceptToAnswer())): (
                                                order.getStatus().getName() == StatusName.ANSWERED ? order.getFirstAnswerAt().plus(Duration.parse(settings.getAnswerToChat())):(
                                                        order.getStatus().getName() == StatusName.CHATTING ? order.getChatAt().plus(Duration.parse(settings.getChat())) :
                                                                order.getCreatedAt()
                                                )
                                        )
                        )
                )).collect(Collectors.toList())))
        );
    }
}
