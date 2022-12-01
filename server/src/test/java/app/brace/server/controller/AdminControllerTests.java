package app.brace.server.controller;

import app.brace.server.config.WebEnvironmentConfig;
import app.brace.server.iosocket.SocketIOServiceImpl;
import app.brace.server.model.AdminRole;
import app.brace.server.model.AdminRoleName;
import app.brace.server.model.TestUser;
import app.brace.server.payload.ApiTestRequest;
import app.brace.server.payload.ApiTestResponse;
import app.brace.server.repository.*;
import app.brace.server.security.PasswordEncoder;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@Order(3)
public class AdminControllerTests extends WebEnvironmentConfig {
    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AdminController adminController;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private AdminRoleRepository adminRoleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private RespondentProfileRepository respondentProfileRepository;

    @Autowired
    private RespondentProfileStatusRepository respondentProfileStatusRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private StatusRepository statusRepository;

    @Autowired
    private SettingsRepository settingsRepository;

    @Autowired
    private SocketIOServiceImpl socketIOServiceImpl;

    @Test
    @Order(0)
    void contextLoad() {
        assertThat(this.restTemplate).isNotNull();
        assertThat(this.passwordEncoder).isNotNull();
        assertThat(this.adminController).isNotNull();
        assertThat(this.adminRepository).isNotNull();
        assertThat(this.adminRoleRepository).isNotNull();
        assertThat(this.userRepository).isNotNull();
        assertThat(this.userRoleRepository).isNotNull();
        assertThat(this.userProfileRepository).isNotNull();
        assertThat(this.respondentProfileRepository).isNotNull();
        assertThat(this.respondentProfileStatusRepository).isNotNull();
        assertThat(this.orderRepository).isNotNull();
        assertThat(this.statusRepository).isNotNull();
        assertThat(this.settingsRepository).isNotNull();
        assertThat(this.socketIOServiceImpl).isNotNull();

        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));

        //注册一批用户供测试使用
        for (int i = 0; i < 20; i++) {
            final String username = "questioner" + i;
            final String email = "questioner" + i + "@watermelon.com";
            final String password = "123456";
            final HttpEntity<Map<String, ?>> request = ApiTestRequest.build(
                    Map.of("username", username,
                            "email", email,
                            "password", password)
            );
            this.restTemplate.postForEntity(this.getUrl("/api/user/signup"), request,
                    ApiTestResponse.class);
        }
        for (int i = 0; i < 20; i++) {
            final String username = "respondent" + i;
            final String email = "respondent" + i + "@watermelon.com";
            final String password = "123456";
            final HttpEntity<Map<String, ?>> request = ApiTestRequest.build(
                    Map.of("username", username,
                            "email", email,
                            "password", password)
            );
            this.restTemplate.postForEntity(this.getUrl("/api/user/signup"), request,
                    ApiTestResponse.class);
        }

        //将部分用户置为回答者
        for (int i = 0; i < 20; ++i) {
            final var user = new TestUser("respondent" + i, "123456", false);
            user.login(this.restTemplate, this.getUrl("/api/user/login"));
            final HttpEntity<Map<String, ?>> request =
                    ApiTestRequest.build(Map.of("specialities", List.of("卖瓜", "吸铁石生产"),
                                    "fee", 0,
                                    "description", "15 斤 30 块",
                                    "detail", "我开水果摊的，能卖给你生瓜蛋子？"),
                            user.getAccessToken());
            final ResponseEntity<ApiTestResponse> response =
                    this.restTemplate.postForEntity(this.getUrl("/api/user/apply"), request,
                            ApiTestResponse.class);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        // 同意 respondent10~20 的申请
        for (int i = 10; i < 20; i++) {
            final HttpEntity<Map<String, ?>> request =
                    ApiTestRequest.build(Map.of("approved", true),
                            TestUser.getRoot().getAccessToken());
            final ResponseEntity<ApiTestResponse> response = this.restTemplate.exchange(
                    this.getUrl("/api/admin/users/respondent" + i + "/censor"), HttpMethod.PUT,
                    request, ApiTestResponse.class);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        }

        // questioner i 对 respondent i 进行提问 (i:10~20)
        for (int i = 10; i < 20; i++) {
            final var user = new TestUser("questioner" + i, "123456", false);
            user.login(this.restTemplate, this.getUrl("/api/user/login"));
            final HttpEntity<Map<String, ?>> request =
                    ApiTestRequest.build(Map.of("title", "关于瓜的若干问题",
                                    "respondent", "respondent" + i,
                                    "description", "哥们儿，这瓜多少钱一斤那",
                                    "isPublic", true),
                            user.getAccessToken());
            var foo = this.restTemplate.postForEntity(this.getUrl("/api/qa/new-question"), request,
                    ApiTestResponse.class);
            assertThat(foo.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        // 添加几个管理员
        List<String> usernames = new ArrayList<>();
        usernames.add("root1");
        usernames.add("root2");
        usernames.add("root3");
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(Map.of("usernames",usernames), TestUser.getRoot().getAccessToken());
        final ResponseEntity<ApiTestResponse> addAdminResponse = this.restTemplate.postForEntity(this.getUrl("/api/admin/addAdmin"),request,ApiTestResponse.class);
        assertThat(addAdminResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        List<Map<String, ?>> admins = (List<Map<String, ?>>) addAdminResponse.getBody().getData().get("admins");
        String password = (String) admins.get(0).get("password");
        final var admin = new TestUser("root1",password,false);
        admin.login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request1 =
                ApiTestRequest.build(Map.of("oldPassword",password,"newPassword","123456aaa"), admin.getAccessToken());
        this.restTemplate.put(this.getUrl("/api/admin/password"),request1);
    }

    @Test
    @Order(1)
    void loginNormal() {
        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));
    }

    @Test
    @Order(2)
    void getActivatedNormal() {
        final var admin = new TestUser("root1","123456aaa",false);
        admin.login(this.restTemplate, this.getUrl("/api/admin/login"));

        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, admin.getAccessToken());
        final ResponseEntity<ApiTestResponse> response = this.restTemplate.exchange(this.getUrl("/api/admin/activated"),HttpMethod.GET,request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("activated");
        assertThat(response.getBody().getData().get("activated")).isEqualTo(true);
    }

    @Test
    void getIsSuperNormal() {
        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, TestUser.getRoot().getAccessToken());
        final ResponseEntity<ApiTestResponse> response = this.restTemplate.exchange(this.getUrl("/api/admin/isSuper"),HttpMethod.GET,request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("isSuper");
        assertThat(response.getBody().getData().get("isSuper")).isEqualTo(true);
    }

    @Test
    void getAdminNormal() {
        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, TestUser.getRoot().getAccessToken());
        final ResponseEntity<ApiTestResponse> response = this.restTemplate.exchange(this.getUrl("/api/admin/admins/root1"),HttpMethod.GET,request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("username");
        assertThat(response.getBody().getData()).containsKey("role");
        assertThat(response.getBody().getData().get("username")).isEqualTo("root1");
        assertThat(response.getBody().getData().get("role")).isEqualTo(Map.of("name",AdminRoleName.ROLE_ADMIN.name()));
    }

    @Test
    void getQuestionsNormal() {
        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, TestUser.getRoot().getAccessToken());
        final ResponseEntity<ApiTestResponse> response = this.restTemplate.exchange(this.getUrl("/api/admin/questions?status=CENSORING&page=0&size=10"),HttpMethod.GET,request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("content");

        List<Map<String, ?>> questions = (List<Map<String, ?>>) response.getBody().getData().get("content");
        for (Map<String, ?> question : questions) {
            assertThat(question).containsKey("id");
            assertThat(question).containsKey("title");
            assertThat(question).containsKey("questioner");
            assertThat(question).containsKey("respondent");
            assertThat(question).containsKey("status");
            assertThat(question).containsKey("createdAt");
        }
    }

    @Test
    void getQuestionNormal() {
        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, TestUser.getRoot().getAccessToken());
        final ResponseEntity<ApiTestResponse> response = this.restTemplate.exchange(this.getUrl("/api/admin/questions?status=CENSORING&page=0&size=10"),HttpMethod.GET,request,ApiTestResponse.class);

        List<Map<String, ?>> questions = (List<Map<String, ?>>) response.getBody().getData().get("content");
        String id = (String) questions.get(0).get("id");

        final ResponseEntity<ApiTestResponse> response1 = this.restTemplate.exchange(this.getUrl("/api/admin/questions/"+id),HttpMethod.GET,request,ApiTestResponse.class);
        assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response1.getBody()).isNotNull();
        assertThat(response1.getBody().getMessage()).isNull();
        assertThat(response1.getBody().getData()).isNotNull();
        assertThat(response1.getBody().getData()).containsKey("id");
        assertThat(response1.getBody().getData()).containsKey("title");
        assertThat(response1.getBody().getData()).containsKey("description");
        assertThat(response1.getBody().getData()).containsKey("questioner");
        assertThat(response1.getBody().getData()).containsKey("respondent");
        assertThat(response1.getBody().getData()).containsKey("status");
        assertThat(response1.getBody().getData()).containsKey("createdAt");
        assertThat(response1.getBody().getData()).containsKey("updatedAt");
        assertThat(response1.getBody().getData()).containsKey("questionerAvatar");
        assertThat(response1.getBody().getData()).containsKey("respondentAvatar");
        assertThat(response1.getBody().getData().get("id")).isEqualTo(id);
        assertThat(response1.getBody().getData().get("status")).isEqualTo("CENSORING");
    }

    @Test
    void getRespondentsNormal() {
        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, TestUser.getRoot().getAccessToken());
        final ResponseEntity<ApiTestResponse> response = this.restTemplate.exchange(this.getUrl("/api/admin/respondents?page=0&size=10"),HttpMethod.GET,request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("content");

        List<Map<String, ?>> respondents = (List<Map<String, ?>>) response.getBody().getData().get("content");
        for (Map<String, ?> respondent : respondents) {
            assertThat(respondent).containsKey("username");
            assertThat(respondent).containsKey("description");
            assertThat(respondent).containsKey("fee");
            assertThat(respondent).containsKey("updatedAt");
            assertThat(respondent).containsKey("avatar");
        }
    }

    @Test
    void getRespondentNormal() {
        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, TestUser.getRoot().getAccessToken());
        final ResponseEntity<ApiTestResponse> response = this.restTemplate.exchange(this.getUrl("/api/admin/respondents/respondent0"),HttpMethod.GET,request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("username");
        assertThat(response.getBody().getData()).containsKey("specialities");
        assertThat(response.getBody().getData()).containsKey("description");
        assertThat(response.getBody().getData()).containsKey("fee");
        assertThat(response.getBody().getData()).containsKey("detail");
        assertThat(response.getBody().getData()).containsKey("avatar");
        assertThat(response.getBody().getData()).containsKey("updatedAt");

        assertThat(response.getBody().getData().get("username")).isEqualTo("respondent0");
        assertThat(response.getBody().getData().get("description")).isEqualTo("15 斤 30 块");
        assertThat(response.getBody().getData().get("fee")).isEqualTo(0);
        assertThat(response.getBody().getData().get("detail")).isEqualTo("我开水果摊的，能卖给你生瓜蛋子？");
        assertThat(response.getBody().getData().get("specialities")).isEqualTo(List.of("卖瓜", "吸铁石生产"));
    }

    @Test
    void putQuestionStatusNormal() {
        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(Map.of("status", "ACCEPTING"), TestUser.getRoot().getAccessToken());
        final HttpEntity<Map<String, ?>> request1 =
                ApiTestRequest.build(null, TestUser.getRoot().getAccessToken());
        final ResponseEntity<ApiTestResponse> response1 = this.restTemplate.exchange(this.getUrl("/api/admin/questions?status=CENSORING&page=0&size=10"),HttpMethod.GET,request1,ApiTestResponse.class);
        final HttpEntity<Map<String, ?>> request2 =
                ApiTestRequest.build(Map.of("status", "FAILED"), TestUser.getRoot().getAccessToken());

        List<Map<String, ?>> questions = (List<Map<String, ?>>) response1.getBody().getData().get("content");
        String id1 = (String) questions.get(0).get("id");
        String id2 = (String) questions.get(1).get("id");

        this.restTemplate.put(this.getUrl("/api/admin/questions/"+id1+"/status"),request);
        this.restTemplate.put(this.getUrl("/api/admin/questions/"+id2+"/status"),request2);
    }

    @Test
    void putUserRoleNormal() {
        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(Map.of("role", "ROLE_RESPONDENT"), TestUser.getRoot().getAccessToken());
        this.restTemplate.put(this.getUrl("/api/admin/users/respondent9/role"),request);

        assertThat(this.userRepository.getByUsername("respondent9").getRole().getName().name()).isEqualTo("ROLE_RESPONDENT");
    }

    @Test
    void censorRespondentNormal() {
        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(Map.of("approved", true), TestUser.getRoot().getAccessToken());
        final HttpEntity<Map<String, ?>> request1 =
                ApiTestRequest.build(Map.of("approved", false), TestUser.getRoot().getAccessToken());
        this.restTemplate.put(this.getUrl("/api/admin/users/respondent8/censor"),request);
        this.restTemplate.put(this.getUrl("/api/admin/users/respondent7/censor"),request1);

        assertThat(this.userRepository.getByUsername("respondent8").getRole().getName().name()).isEqualTo("ROLE_RESPONDENT");
        assertThat(this.userRepository.getByUsername("respondent7").getRole().getName().name()).isEqualTo("ROLE_USER");
    }

    @Test
    @Order(3)
    void putPasswordNormal() {
        final var admin = new TestUser("root1","123456aaa",false);
        admin.login(this.restTemplate, this.getUrl("/api/admin/login"));

        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(Map.of("oldPassword","123456aaa","newPassword","123456AAA"), admin.getAccessToken());
        this.restTemplate.put(this.getUrl("/api/admin/password"),request);
    }

    @Test
    void addAdminNormal() {
        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(Map.of("usernames",List.of("root4","root5")), TestUser.getRoot().getAccessToken());
        final ResponseEntity<ApiTestResponse> response = this.restTemplate.postForEntity(this.getUrl("/api/admin/addAdmin"),request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("admins");

        List<Map<String, ?>> admins = (List<Map<String, ?>>) response.getBody().getData().get("admins");
        assertThat(admins.size()).isEqualTo(2);
        for (Map<String, ?> admin: admins) {
            assertThat(admin).containsKey("username");
            assertThat(admin).containsKey("password");
        }
    }

    @Test
    void getAdminsNormal(){
        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, TestUser.getRoot().getAccessToken());
        final ResponseEntity<ApiTestResponse> response = this.restTemplate.exchange(this.getUrl("/api/admin/admins?page=0&size=10"),HttpMethod.GET,request,ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("content");

        List<Map<String, ?>> admins = (List<Map<String, ?>>) response.getBody().getData().get("content");
        for (Map<String, ?> admin: admins) {
            assertThat(admin).containsKey("username");
            assertThat(admin).containsKey("role");
        }
    }

    @Test
    void getArgsNormal() {
        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, TestUser.getRoot().getAccessToken());
        final ResponseEntity<ApiTestResponse> response = this.restTemplate.exchange(this.getUrl("/api/admin/args"),HttpMethod.GET,request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("timeout");
        assertThat(response.getBody().getData()).containsKey("fee");

        Map<String, ?> timeout = (Map<String, ?>) response.getBody().getData().get("timeout");
        assertThat(timeout).containsKey("beforeAccept");
        assertThat(timeout).containsKey("acceptToAnswer");
        assertThat(timeout).containsKey("answerToChat");
        assertThat(timeout).containsKey("chat");

        assertThat(response.getBody().getData().get("fee")).isEqualTo((int)(this.settingsRepository.getSettingsByFake("setting").getMaxFee()));
        assertThat(timeout.get("beforeAccept")).isEqualTo(this.settingsRepository.getSettingsByFake("setting").getBeforeAccept());
        assertThat(timeout.get("acceptToAnswer")).isEqualTo(this.settingsRepository.getSettingsByFake("setting").getAcceptToAnswer());
        assertThat(timeout.get("answerToChat")).isEqualTo(this.settingsRepository.getSettingsByFake("setting").getAnswerToChat());
        assertThat(timeout.get("chat")).isEqualTo(this.settingsRepository.getSettingsByFake("setting").getChat());
    }

    @Test
    void putArgsNormal() {
        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(Map.of("fee", 100, "timeout", Map.of("beforeAccept", Duration.ofMinutes(60).toString(),
                                                                                        "acceptToAnswer", Duration.ofMinutes(60).toString(),
                                                                                        "answerToChat", Duration.ofMinutes(60).toString(),
                                                                                        "chat", Duration.ofMinutes(60).toString())), TestUser.getRoot().getAccessToken());
        this.restTemplate.put(this.getUrl("/api/admin/args"),request);
        assertThat(this.settingsRepository.getSettingsByFake("setting").getMaxFee()).isEqualTo(100);
        assertThat(this.settingsRepository.getSettingsByFake("setting").getBeforeAccept()).isEqualTo(Duration.ofMinutes(60).toString());
        assertThat(this.settingsRepository.getSettingsByFake("setting").getAcceptToAnswer()).isEqualTo(Duration.ofMinutes(60).toString());
        assertThat(this.settingsRepository.getSettingsByFake("setting").getAnswerToChat()).isEqualTo(Duration.ofMinutes(60).toString());
        assertThat(this.settingsRepository.getSettingsByFake("setting").getChat()).isEqualTo(Duration.ofMinutes(60).toString());
    }

    @Test
    void getAdminUsernameNotFound() {
        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, TestUser.getRoot().getAccessToken());
        final ResponseEntity<ApiTestResponse> response = this.restTemplate.exchange(this.getUrl("/api/admin/admins/nobody"),HttpMethod.GET,request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getAdminForbidden() {
        final var admin = new TestUser("root1","123456AAA",false);
        admin.login(this.restTemplate, this.getUrl("/api/admin/login"));

        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, admin.getAccessToken());
        final ResponseEntity<ApiTestResponse> response = this.restTemplate.exchange(this.getUrl("/api/admin/admins/root2"),HttpMethod.GET,request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void getQuestionNotFound() {
        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, TestUser.getRoot().getAccessToken());

        UUID id = UUID.randomUUID();
        final ResponseEntity<ApiTestResponse> response = this.restTemplate.exchange(this.getUrl("/api/admin/questions/"+id),HttpMethod.GET,request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getRespondentNotFound() {
        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, TestUser.getRoot().getAccessToken());
        final ResponseEntity<ApiTestResponse> response = this.restTemplate.exchange(this.getUrl("/api/admin/respondents/nobody"),HttpMethod.GET,request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void putQuestionStatusQuestionNotFound() {
        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(Map.of("status", "ACCEPTING"), TestUser.getRoot().getAccessToken());

        UUID id = UUID.randomUUID();
        final ResponseEntity<ApiTestResponse> response = this.restTemplate.exchange(this.getUrl("/api/admin/questions/"+id+"/status"),HttpMethod.PUT,request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void putUserRoleUsernameNotFound() {
        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(Map.of("role", "ROLE_RESPONDENT"), TestUser.getRoot().getAccessToken());
        final ResponseEntity<ApiTestResponse> response = this.restTemplate.exchange(this.getUrl("/api/admin/users/nobody/role"),HttpMethod.PUT,request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void censorRespondentNotFound() {
        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(Map.of("approved", true), TestUser.getRoot().getAccessToken());
        final ResponseEntity<ApiTestResponse> response = this.restTemplate.exchange(this.getUrl("/api/admin/users/nobody/censor"),HttpMethod.PUT,request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void putPasswordWrongOldPassword() {
        final var admin = new TestUser("root1","123456AAA",false);
        admin.login(this.restTemplate, this.getUrl("/api/admin/login"));

        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(Map.of("oldPassword","thisiswrong","newPassword","123456"), admin.getAccessToken());
        final ResponseEntity<ApiTestResponse> response = this.restTemplate.exchange(this.getUrl("/api/admin/password"),HttpMethod.PUT,request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void addAdminAlreadyExist() {
        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(Map.of("usernames",List.of("root1","root2")), TestUser.getRoot().getAccessToken());
        final ResponseEntity<ApiTestResponse> response = this.restTemplate.postForEntity(this.getUrl("/api/admin/addAdmin"),request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("admins");

        List<Map<String, ?>> admins = (List<Map<String, ?>>) response.getBody().getData().get("admins");
        assertThat(admins.size()).isEqualTo(2);
        for (Map<String, ?> admin: admins) {
            assertThat(admin).containsKey("username");
            assertThat(admin).doesNotContainKey("password");
        }
    }
}
