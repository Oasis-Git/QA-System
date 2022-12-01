package app.brace.server.controller;

import app.brace.server.config.WebEnvironmentConfig;
import app.brace.server.model.TestUser;
import app.brace.server.model.User;
import app.brace.server.model.UserProfile;
import app.brace.server.model.UserRoleName;
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

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@Order(2)
public class UserControllerTests extends WebEnvironmentConfig {
    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserController userController;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RespondentProfileRepository respondentProfileRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Test
    @Order(0)
    void contextLoad() {
        assertThat(this.restTemplate).isNotNull();

        assertThat(this.passwordEncoder).isNotNull();

        assertThat(this.userController).isNotNull();

        assertThat(this.orderRepository).isNotNull();
        assertThat(this.respondentProfileRepository).isNotNull();
        assertThat(this.userProfileRepository).isNotNull();
        assertThat(this.userRepository).isNotNull();
        assertThat(this.userRoleRepository).isNotNull();

        TestUser.getRoot().login(this.restTemplate, this.getUrl("/api/admin/login"));

        //注册一批用户供测试使用
        for (int i = 0; i < 20; i++) {
            final String username = "huaqiang" + i;
            final String email = "qiang" + i + "@watermelon.com";
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
            final String username = "haoge" + i;
            final String email = "hao" + i + "@watermelon.com";
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
            final var user = new TestUser("haoge" + i, "123456", false);
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

        for (int i = 0; i < 20; i++) {
            final HttpEntity<Map<String, ?>> request =
                    ApiTestRequest.build(Map.of("approved", true),
                                         TestUser.getRoot().getAccessToken());
            final ResponseEntity<ApiTestResponse> response = this.restTemplate.exchange(
                    this.getUrl("/api/admin/users/haoge" + i + "/censor"), HttpMethod.PUT,
                    request, ApiTestResponse.class);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        }
        final var haoge = new TestUser("haoge0", "123456", true);
        haoge.login(this.restTemplate, this.getUrl("/api/user/login"));

        // huaqiang i 对 haoge i 进行提问
        for (int i = 0; i < 20; i++) {
            final var user = new TestUser("huaqiang" + i, "123456", false);
            user.login(this.restTemplate, this.getUrl("/api/user/login"));
            final HttpEntity<Map<String, ?>> request =
                    ApiTestRequest.build(Map.of("title", "关于瓜的若干问题",
                                                "respondent", "haoge" + i,
                                                "description", "哥们儿，这瓜多少钱一斤那",
                                                "isPublic", true),
                                         user.getAccessToken());
            var foo = this.restTemplate.postForEntity(this.getUrl("/api/qa/new-question"), request,
                                            ApiTestResponse.class);
            assertThat(foo.getStatusCode()).isEqualTo(HttpStatus.OK);
        }
    }

    @Test
    @Order(1)
    void signupNormal() {
        final String username = "qBall";
        final String email = "q@ba.ll";
        final String password = "QbALL";

        final HttpEntity<Map<String, ?>> request = ApiTestRequest.build(
                Map.of("username", username,
                       "email", email,
                       "password", password)
        );

        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.postForEntity(this.getUrl("/api/user/signup"), request,
                                                ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getData()).isNull();
        assertThat(response.getBody().getMessage()).isNull();

        final Optional<User> user = this.userRepository.findByUsername(username);
        assertThat(user).isPresent();
        assertThat(user.get().getUsername()).isEqualTo(username);
        assertThat(this.passwordEncoder).matches(
                encoder -> encoder.matches(password, user.get().getPassword()));
        assertThat(user.get().getRole()).isEqualTo(
                this.userRoleRepository.getByName(UserRoleName.ROLE_USER));

        final Optional<UserProfile> userProfile =
                this.userProfileRepository.findByUsername(username);
        assertThat(userProfile).isPresent();
        assertThat(userProfile.get().getUsername()).isEqualTo(username);
        assertThat(userProfile.get().getUser()).isEqualTo(user.get());
        assertThat(userProfile.get().getEmail()).isEqualTo(email);
        assertThat(userProfile.get().getRemaining()).isEqualTo(0);
        // TODO avatar

        assertThat(this.orderRepository.existsByQuestionerUsername(username)).isFalse();
        assertThat(this.orderRepository.existsByRespondentUsername(username)).isFalse();

        assertThat(this.respondentProfileRepository.existsByUsername(username)).isFalse();
    }

    @Test
    @Order(2)
    void loginNormal() {
        final var user = new TestUser("qBall", "QbALL", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
    }

    @Test
    void getInfoNavBarNormal() {
        final var user = new TestUser("qBall", "QbALL", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request = ApiTestRequest.build(null,
                                                                        user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/navbar"),
                                           HttpMethod.GET, request, ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("username");
        assertThat(response.getBody().getData().get("username")).isEqualTo(user.getUsername());
        assertThat(response.getBody().getData()).containsKey("email");
        assertThat(response.getBody().getData().get("email"))
                .isEqualTo(this.userProfileRepository.getByUsername(user.getUsername())
                                                     .getEmail()
                );
        // TODO avatar
    }

    @Test
    void getInfoSideBarNormalUser() {
        final var user = new TestUser("huaqiang1", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/sidebar"),
                                           HttpMethod.GET, request, ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("username");
        assertThat(response.getBody().getData().get("username")).isEqualTo(user.getUsername());
        assertThat(response.getBody().getData()).containsKey("identity");
        assertThat(response.getBody().getData().get("identity")).isEqualTo("用户");
    }

    @Test
    void getInfoSideBarNormalRespondent() {
        final var user = new TestUser("haoge1", "123456", true);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/sidebar"),
                                           HttpMethod.GET, request, ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("username");
        assertThat(response.getBody().getData().get("username")).isEqualTo(user.getUsername());
        assertThat(response.getBody().getData()).containsKey("identity");
        assertThat(response.getBody().getData().get("identity")).isEqualTo("回答者");
    }

    @Test
    void getProfileNormalUser() {
        final var user = new TestUser("huaqiang1", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/huaqiang1/profile"),
                                           HttpMethod.GET, request, ApiTestResponse.class);

        final Optional<UserProfile> userInRepository =
                this.userProfileRepository.findByUsername(user.getUsername());
        assertThat(userInRepository).isPresent();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("username");
        assertThat(response.getBody().getData().get("username")).isEqualTo(user.getUsername());
        assertThat(response.getBody().getData()).containsKey("email");
        assertThat(response.getBody().getData().get("email")).isEqualTo(
                userInRepository.get().getEmail());
        // TODO: 补上新增字段的检查，见 ApiFox
        assertThat(response.getBody().getData()).containsKey("avatar");
        assertThat(response.getBody().getData().get("avatar"))
                .isEqualTo(userInRepository.get().getAvatar());
    }

    @Test
    void getProfileNormalRespondent() {
        final var user = new TestUser("haoge1", "123456", true);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/haoge1/profile"),
                                           HttpMethod.GET, request, ApiTestResponse.class);

        final Optional<UserProfile> userInRepository =
                this.userProfileRepository.findByUsername(user.getUsername());
        assertThat(userInRepository).isPresent();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("username");
        assertThat(response.getBody().getData().get("username")).isEqualTo(user.getUsername());
        assertThat(response.getBody().getData()).containsKey("email");
        assertThat(response.getBody().getData().get("email"))
                .isEqualTo(userInRepository.get().getEmail());
        // TODO: 补上新增字段的检查，见 ApiFox
        assertThat(response.getBody().getData()).containsKey("avatar");
        assertThat(response.getBody().getData().get("avatar"))
                .isEqualTo(userInRepository.get().getAvatar());
    }

    @Test
    void signupDuplicateUsername() {
        final String username = "huaqiang0";
        final String email = "guatan@gua.com";
        final String password = "123456";

        final HttpEntity<Map<String, ?>> request = ApiTestRequest.build(
                Map.of("username", username,
                       "email", email,
                       "password", password)
        );

        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.postForEntity(this.getUrl("/api/user/signup"), request,
                                                ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void signupDuplicateEmail() {
        final String username = "yueping";
        final String email = "qiang0@watermelon.com";
        final String password = "123456";

        final HttpEntity<Map<String, ?>> request = ApiTestRequest.build(
                Map.of("username", username,
                       "email", email,
                       "password", password)
        );

        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.postForEntity(this.getUrl("/api/user/signup"), request,
                                                ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void getProfileNotFound() {
        final var user = new TestUser("huaqiang1", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/notexist/profile"),
                                           HttpMethod.GET, request, ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getProfileForbidden() {
        final var user = new TestUser("haoge1", "123456", true);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/huaqiang1/profile"),
                                           HttpMethod.GET, request, ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void getProfileMissingRespondentProfile() {
        HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(Map.of("role", UserRoleName.ROLE_RESPONDENT),
                                     TestUser.getRoot().getAccessToken());
        ResponseEntity<ApiTestResponse> response = this.restTemplate.exchange(
                this.getUrl("/api/admin/users/qBall/role"), HttpMethod.PUT,
                request, ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        final var user = new TestUser("qBall", "QbALL", true);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        request = ApiTestRequest.build(null, user.getAccessToken());
        response = this.restTemplate.exchange(this.getUrl("/api/user/qBall/profile"),
                                              HttpMethod.GET, request, ApiTestResponse.class);

        final Optional<UserProfile> userInRepository =
                this.userProfileRepository.findByUsername(user.getUsername());
        assertThat(userInRepository).isPresent();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Test
    void getUserOrdersNormalUser() {
        final var user = new TestUser("huaqiang1", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/orders?page=0&perpage=5"),HttpMethod.GET,request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("questions");
        assertThat(response.getBody().getData()).containsKey("count");
        assertThat(response.getBody().getData().get("count")).isEqualTo(1);
    }

    @Test
    void getUserQuestionsNormalRespondent(){
        final var user = new TestUser("haoge1", "123456", true);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/questions?page=0&perpage=5"),HttpMethod.GET,request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("questions");
        assertThat(response.getBody().getData()).containsKey("count");
        assertThat(response.getBody().getData().get("count")).isEqualTo(0);
    }

    @Test
    void getUserQuestionsForbidden(){
        final var user = new TestUser("huaqiang1", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/questions?page=0&perpage=5"),HttpMethod.GET,request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void postInfoChangeNormalUser(){
        final var user = new TestUser("huaqiang1", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(Map.of("wechat", "12345",
                                "weibo", "12345",
                                "location", "衡州市",
                                "avatar", "/avatar.png"),
                        user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.postForEntity(this.getUrl("/api/user/settings/basic"), request,
                        ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void getInfoNowNormal(){
        final var user = new TestUser("huaqiang1", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/settings/basic"),HttpMethod.GET,request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("wechat");
        assertThat(response.getBody().getData()).containsKey("weibo");
        assertThat(response.getBody().getData()).containsKey("avatar");
        assertThat(response.getBody().getData()).containsKey("location");
        assertThat(response.getBody().getData().get("wechat")).isEqualTo("12345");
        assertThat(response.getBody().getData().get("weibo")).isEqualTo("12345");
        assertThat(response.getBody().getData().get("location")).isEqualTo("衡州市");
        assertThat(response.getBody().getData().get("avatar")).isEqualTo("/avatar.png");
    }

    @Test
    void getExpenseNormalUser(){
        final var user = new TestUser("huaqiang1", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/dashboard/banking/expense"),HttpMethod.GET,request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("expense");
        assertThat(response.getBody().getData()).containsKey("balance");
        assertThat(response.getBody().getData().get("expense")).isEqualTo(0);
        assertThat(response.getBody().getData().get("balance")).isEqualTo(0);
    }

    @Test
    void getIncomeNormalRespondent(){
        final var user = new TestUser("haoge1", "123456", true);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/dashboard/banking/income"),HttpMethod.GET,request,ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("income");
        assertThat(response.getBody().getData()).containsKey("balance");
        assertThat(response.getBody().getData().get("income")).isEqualTo(0);
        assertThat(response.getBody().getData().get("balance")).isEqualTo(0);
    }

    @Test
    void getIncomeNotFound(){
        final var user = new TestUser("huaqiang1", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/dashboard/banking/income"),HttpMethod.GET,request,ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void isSuperNormalRespondent(){
        final var user = new TestUser("haoge1", "123456", true);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/isSuper"),HttpMethod.GET,request,ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("isSuper");
        assertThat(response.getBody().getData().get("isSuper")).isEqualTo(true);
    }

    @Test
    void changePasswordBadRequest(){
        final var user = new TestUser("huaqiang3", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(Map.of("newPassword", "12345",
                                "oldPassword", "1234567"),
                        user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.postForEntity(this.getUrl("/api/user/settings/password"),request,ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void depositNormal(){
        final var user = new TestUser("huaqiang4", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(Map.of("amount", 30),
                        user.getAccessToken());
        final ResponseEntity<Object> response =
                this.restTemplate.postForEntity(this.getUrl("/api/user/banking/deposit"),request,Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void validateEmailNormal(){
        final HttpEntity<Map<String, ?>> request = ApiTestRequest.build(
                Map.of("email", "qiang1@watermelon.com")
        );
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.postForEntity(this.getUrl("/api/user/resetPassword/validateEmail"), request, ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("username");
        assertThat(response.getBody().getData().get("username")).isEqualTo("huaqiang1");
    }

    @Test
    void validateEmailBadRequest(){
        final HttpEntity<Map<String, ?>> request = ApiTestRequest.build(
                Map.of("email", "sgfsgds@sadfsg.com")
        );
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.postForEntity(this.getUrl("/api/user/resetPassword/validateEmail"), request, ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void resetPasswordNormal(){
        final HttpEntity<Map<String, ?>> request = ApiTestRequest.build(
                Map.of("username", "huaqiang2",
                        "password", "1234567")
        );
        final ResponseEntity<Object> response =
                this.restTemplate.postForEntity(this.getUrl("/api/user/resetPassword"), request, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void getRoleInChatNormalUser(){
        final var user = new TestUser("huaqiang1", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/orders?page=0&perpage=5"),HttpMethod.GET,request,ApiTestResponse.class);
        try{
            List<Map<String, Object>> list= (List<Map<String, Object>>)response.getBody().getData().get("questions");
            Map<String, Object> map = list.get(0);
            String id = map.get("id").toString();
            final ResponseEntity<ApiTestResponse> response2 =
                    this.restTemplate.exchange(this.getUrl("/api/user/chat/"+id+"/role"),HttpMethod.GET,request,ApiTestResponse.class);
            assertThat(response2.getStatusCode()).isEqualTo(HttpStatus.OK);
        } catch (Exception ignored){ }
    }

    @Test
    void getRoleInChatNotFound(){
        final var user = new TestUser("huaqiang1", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response2 =
                this.restTemplate.exchange(this.getUrl("/api/user/chat/c2cfa541-21a5-4244-bf56-2131666e5886/role"),HttpMethod.GET,request,ApiTestResponse.class);
        assertThat(response2.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getRoleInChatNormalRespondent(){
        final var user = new TestUser("haoge1", "123456", true);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/questions?page=0&perpage=5"),HttpMethod.GET,request,ApiTestResponse.class);
        try{
            List<Map<String, Object>> list= (List<Map<String, Object>>)response.getBody().getData().get("questions");
            Map<String, Object> map = list.get(0);
            String id = map.get("id").toString();
            final ResponseEntity<ApiTestResponse> response2 =
                    this.restTemplate.exchange(this.getUrl("/api/user/chat/"+id+"/role"),HttpMethod.GET,request,ApiTestResponse.class);
            assertThat(response2.getStatusCode()).isEqualTo(HttpStatus.OK);
        } catch (Exception ignored){ }
    }

    @Test
    void getRoleInChatBadRequest(){
        final var user = new TestUser("haoge1", "123456", true);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/questions?page=0&perpage=5"),HttpMethod.GET,request,ApiTestResponse.class);
        try{
            List<Map<String, Object>> list= (List<Map<String, Object>>)response.getBody().getData().get("questions");
            Map<String, Object> map = list.get(0);
            String id = map.get("id").toString();
            final var user2 = new TestUser("haoge2", "123456", true);
            user2.login(this.restTemplate, this.getUrl("/api/user/login"));
            final HttpEntity<Map<String, ?>> request2 =
                    ApiTestRequest.build(null, user2.getAccessToken());
            final ResponseEntity<ApiTestResponse> response2 =
                    this.restTemplate.exchange(this.getUrl("/api/user/chat/"+id+"/role"),HttpMethod.GET,request2,ApiTestResponse.class);
            assertThat(response2.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        } catch (Exception ignored){ }
    }

    @Test
    void getRespondentInfoInChatNormal(){
        final var user = new TestUser("huaqiang1", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/orders?page=0&perpage=5"),HttpMethod.GET,request,ApiTestResponse.class);
        try{
            List<Map<String, Object>> list= (List<Map<String, Object>>)response.getBody().getData().get("questions");
            Map<String, Object> map = list.get(0);
            String id = map.get("id").toString();
            final ResponseEntity<ApiTestResponse> response2 =
                    this.restTemplate.exchange(this.getUrl("/api/user/chat/"+id+"/respondent"),HttpMethod.GET,request,ApiTestResponse.class);
            assertThat(response2.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response2.getBody()).isNotNull();
            assertThat(response2.getBody().getMessage()).isNull();
            assertThat(response2.getBody().getData()).isNotNull();
            assertThat(response2.getBody().getData()).containsKey("wechat");
            assertThat(response2.getBody().getData()).containsKey("weibo");
            assertThat(response2.getBody().getData()).containsKey("avatar");
            assertThat(response2.getBody().getData()).containsKey("username");
            assertThat(response2.getBody().getData()).containsKey("description");
            assertThat(response2.getBody().getData()).containsKey("email");
            assertThat(response2.getBody().getData()).containsKey("specialities");
            assertThat(response2.getBody().getData()).containsKey("isOnline");
        } catch (Exception ignored){ }
    }

    @Test
    void getRespondentInfoInChatNotFound(){
        final var user = new TestUser("huaqiang1", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response2 =
                this.restTemplate.exchange(this.getUrl("/api/user/chat/c2cfa541-21a5-4244-bf56-2131666e5886/respondent"),HttpMethod.GET,request,ApiTestResponse.class);
        assertThat(response2.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getQuestionerInfoInChatNormal(){
        final var user = new TestUser("huaqiang1", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/orders?page=0&perpage=5"),HttpMethod.GET,request,ApiTestResponse.class);
        try{
            List<Map<String, Object>> list= (List<Map<String, Object>>)response.getBody().getData().get("questions");
            Map<String, Object> map = list.get(0);
            String id = map.get("id").toString();
            final ResponseEntity<ApiTestResponse> response2 =
                    this.restTemplate.exchange(this.getUrl("/api/user/chat/"+id+"/questioner"),HttpMethod.GET,request,ApiTestResponse.class);
            assertThat(response2.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response2.getBody()).isNotNull();
            assertThat(response2.getBody().getMessage()).isNull();
            assertThat(response2.getBody().getData()).isNotNull();
            assertThat(response2.getBody().getData()).containsKey("avatar");
            assertThat(response2.getBody().getData()).containsKey("username");
            assertThat(response2.getBody().getData()).containsKey("email");
            assertThat(response2.getBody().getData()).containsKey("isOnline");
        } catch (Exception ignored){ }
    }

    @Test
    void getQuestionerInfoInChatNotFound(){
        final var user = new TestUser("huaqiang1", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response2 =
                this.restTemplate.exchange(this.getUrl("/api/user/chat/c2cfa541-21a5-4244-bf56-2131666e5886/questioner"),HttpMethod.GET,request,ApiTestResponse.class);
        assertThat(response2.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getOrderInfoInChatNotFound(){
        final var user = new TestUser("huaqiang1", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response2 =
                this.restTemplate.exchange(this.getUrl("/api/user/chat/c2cfa541-21a5-4244-bf56-2131666e5886/question"),HttpMethod.GET,request,ApiTestResponse.class);
        assertThat(response2.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getChatInfoInChatNotExist(){
        final var user = new TestUser("huaqiang1", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response2 =
                this.restTemplate.exchange(this.getUrl("/api/user/chat/c2cfa541-21a5-4244-bf56-2131666e5886/message"),HttpMethod.GET,request,ApiTestResponse.class);
        assertThat(response2.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getChatInfoInChatNotFound(){
        final var user = new TestUser("huaqiang1", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/orders?page=0&perpage=5"),HttpMethod.GET,request,ApiTestResponse.class);
        try{
            List<Map<String, Object>> list= (List<Map<String, Object>>)response.getBody().getData().get("questions");
            Map<String, Object> map = list.get(0);
            String id = map.get("id").toString();
            final ResponseEntity<ApiTestResponse> response2 =
                    this.restTemplate.exchange(this.getUrl("/api/user/chat/"+id+"/message"),HttpMethod.GET,request,ApiTestResponse.class);
            assertThat(response2.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        } catch (Exception ignored){ }
    }


    @Test
    void changeInfoInSettingNormal(){
        final var user = new TestUser("haoge1", "123456", true);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        List<String> list = List.of("唱","跳","RAP");
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(Map.of(
                        "specialities", list,
                        "fee", 15,
                        "about", "练习两年半的cxk",
                        "detail", "asfsagrgtwtheth"),
                        user.getAccessToken());
        final ResponseEntity<Object> response =
                this.restTemplate.postForEntity(this.getUrl("/api/user/settings/respondent"), request, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void getRespondentInfoChangeNormal(){
        final var user = new TestUser("haoge5", "123456", true);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/settings/respondent"),HttpMethod.GET,request,ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("specialities");
        assertThat(response.getBody().getData()).containsKey("fee");
        assertThat(response.getBody().getData()).containsKey("about");
        assertThat(response.getBody().getData()).containsKey("detail");
    }

    @Test
    void getCalendarInfoNormal(){
        final var user = new TestUser("huaqiang1", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/dashboard/calendar"),HttpMethod.GET,request,ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("events");
    }


}
