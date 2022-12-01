package app.brace.server.controller;

import app.brace.server.config.WebEnvironmentConfig;
import app.brace.server.model.TestUser;
import app.brace.server.model.User;
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

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;


@Order(1)
public class QaControllerTests extends WebEnvironmentConfig {
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
            final String username = "huaqiang_hzx" + i;
            final String email = "qiang_hzx" + i + "@watermelon.com";
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
            final String username = "haoge_hzx" + i;
            final String email = "hao_hzx" + i + "@watermelon.com";
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
            final var user = new TestUser("haoge_hzx" + i, "123456", false);
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
                    this.getUrl("/api/admin/users/haoge_hzx" + i + "/censor"), HttpMethod.PUT,
                    request, ApiTestResponse.class);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        }
        final var haoge = new TestUser("haoge_hzx0", "123456", true);
        haoge.login(this.restTemplate, this.getUrl("/api/user/login"));

        // huaqiang i 对 haoge i 进行提问
        for (int i = 0; i < 20; i++) {
            final var user = new TestUser("huaqiang_hzx" + i, "123456", false);
            user.login(this.restTemplate, this.getUrl("/api/user/login"));
            final HttpEntity<Map<String, ?>> request =
                    ApiTestRequest.build(Map.of("title", "关于瓜的若干问题",
                                    "respondent", "haoge_hzx" + i,
                                    "description", "哥们儿，这瓜多少钱一斤那",
                                    "isPublic", true),
                            user.getAccessToken());
            var foo = this.restTemplate.postForEntity(this.getUrl("/api/qa/new-question"), request,
                    ApiTestResponse.class);
            assertThat(foo.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        //admin approve all questions
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null,
                        TestUser.getRoot().getAccessToken());
        final ResponseEntity<ApiTestResponse> response = this.restTemplate.exchange(
                this.getUrl("/api/admin/questions?status=CENSORING&page=0&size=20"), HttpMethod.GET,
                request, ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(Objects.requireNonNull(response.getBody()).getData()).isNotNull();
        final List<Map<String, ?>> questionList = (List<Map<String, ?>>) response.getBody().getData().get("content");
        for (int i = 0;i < questionList.size();i++) {
            final String id = (String) questionList.get(i).get("id");
            final HttpEntity<Map<String, ?>> request1 =
                    ApiTestRequest.build(Map.of("status", "ACCEPTING"),
                            TestUser.getRoot().getAccessToken());
            final ResponseEntity<ApiTestResponse> response1 = this.restTemplate.exchange(
                    this.getUrl("/api/admin/questions/"+id+"/status"), HttpMethod.PUT,
                    request1, ApiTestResponse.class);
            assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        }
    }

    @Test
    @Order(1)
    void getRespondentsNormal() {
        final HttpEntity<Map<String, ?>> request = ApiTestRequest.build(null, null);

        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/qa/respondents?page=0&size=5"),
                        HttpMethod.GET, request, ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("respondents");
        assertThat(response.getBody().getData()).containsKey("page");
        assertThat(response.getBody().getData().get("respondents")).isNotNull();

        List<?> respondentList = (List<?>)response.getBody().getData().get("respondents");
        for (int i = 0;i < respondentList.size();i++)
        {
            assertThat(respondentList.get(i)).isNotNull();
        }

        //TODO: check respondent list item
    }

    @Test
    @Order(2)
    void getRespondentNormal() {
        for (int i = 0;i < 20;i++) {
            final var user = new TestUser("huaqiang_hzx" + i, "123456", false);
            user.login(this.restTemplate, this.getUrl("/api/user/login"));
            final HttpEntity<Map<String, ?>> request =
                    ApiTestRequest.build(null, user.getAccessToken());
            final ResponseEntity<ApiTestResponse> response =
                    this.restTemplate.exchange(this.getUrl("/api/qa/haoge_hzx"+i+"/profile"), HttpMethod.GET, request, ApiTestResponse.class);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).isNull();
            assertThat(response.getBody().getData()).isNotNull();
            assertThat(response.getBody().getData()).containsKey("specialities");
            assertThat(response.getBody().getData()).containsKey("fee");
            assertThat(response.getBody().getData().get("specialities")).isNotNull();
            assertThat(response.getBody().getData().get("fee")).isNotNull();
        }
    }

    @Test
    @Order(3)
    void acceptOrderNormal(){
        for (int i = 0;i < 10;i++)
        {
            final var user = new TestUser("haoge_hzx"+i, "123456", true);
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

            final List<Map<String, ?>> questions = (List<Map<String, ?>>) response.getBody().getData().get("questions");
            String id = (String) questions.get(0).get("id");

            final ResponseEntity<String> response1 =
                    this.restTemplate.postForEntity(this.getUrl("/api/qa/"+id+"/accept"), request,
                            String.class);
            assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response1.getBody()).isNotNull();
        }
    }

    @Test
    @Order(4)
    void postAnswerForFirstNormal() {
        for (int i = 0;i < 10;i++) {
            final var user = new TestUser("haoge_hzx" + i, "123456", true);
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

            final List<Map<String, ?>> questions = (List<Map<String, ?>>) response.getBody().getData().get("questions");
            String id = (String) questions.get(0).get("id");
            final String content = "xxxxx";

            final HttpEntity<Map<String, ?>> request1 = ApiTestRequest.build(
                    Map.of("content", content), user.getAccessToken()
            );

            final ResponseEntity<ApiTestResponse> response1 =
                    this.restTemplate.postForEntity(this.getUrl("/api/qa/"+id+"/response"), request1,
                            ApiTestResponse.class);

            assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response1.getBody()).isNotNull();
            assertThat(response1.getBody().getData()).isNull();
            assertThat(response1.getBody().getMessage()).isNull();
        }
    }

    @Test
    @Order(5)
    void refuseOrderNormal(){
        for (int i = 10;i < 20;i++)
        {
            final var user = new TestUser("haoge_hzx"+i, "123456", true);
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

            final List<Map<String, ?>> questions = (List<Map<String, ?>>) response.getBody().getData().get("questions");
            String id = (String) questions.get(0).get("id");

            final ResponseEntity<String> response1 =
                    this.restTemplate.postForEntity(this.getUrl("/api/qa/"+id+"/refuse"), request,
                            String.class);
            assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response1.getBody()).isNotNull();
        }
    }

    @Test
    @Order(6)
    void postQuestionNormal(){
        for (int i = 0; i < 20; i++) {
            final var user = new TestUser("huaqiang_hzx" + i, "123456", false);
            user.login(this.restTemplate, this.getUrl("/api/user/login"));
            final HttpEntity<Map<String, ?>> request =
                    ApiTestRequest.build(Map.of("title", "关于瓜的若干问题",
                                    "respondent", "haoge_hzx" + i,
                                    "description", "哥们儿，这瓜多少钱一斤那",
                                    "isPublic", true),
                            user.getAccessToken());
            var foo = this.restTemplate.postForEntity(this.getUrl("/api/qa/new-question"), request,
                    ApiTestResponse.class);
            assertThat(foo.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(foo.getBody()).isNotNull();
            assertThat(foo.getBody().getMessage()).isNull();
            assertThat(foo.getBody().getData()).isNotNull();
            assertThat(foo.getBody().getData()).containsKey("id");
        }
    }

    @Test
    @Order(7)
    void getQuestionNormal(){
        for (int i = 0;i < 20;i++) {
            final var user = new TestUser("huaqiang_hzx"+i, "123456", false);
            user.login(this.restTemplate, this.getUrl("/api/user/login"));
            final HttpEntity<Map<String, ?>> request =
                    ApiTestRequest.build(null, user.getAccessToken());
            final ResponseEntity<ApiTestResponse> response =
                    this.restTemplate.exchange(this.getUrl("/api/qa/confirm/haoge_hzx"+i),HttpMethod.GET,request,ApiTestResponse.class);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).isNull();
            assertThat(response.getBody().getData()).isNotNull();
            assertThat(response.getBody().getData()).containsKey("avatar");
            assertThat(response.getBody().getData()).containsKey("fee");
            assertThat(response.getBody().getData()).containsKey("specialties");
        }
    }

    @Test
    @Order(8)
    void getQuestionContentNormal(){
        for (int i = 0;i < 20;i++) {
            final var user = new TestUser("huaqiang_hzx"+i, "123456", false);
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

            final List<Map<String, ?>> orders = (List<Map<String, ?>>) response.getBody().getData().get("questions");
            String id = (String) orders.get(0).get("id");

            final HttpEntity<Map<String, ?>> request1 =
                    ApiTestRequest.build(null, user.getAccessToken());
            final ResponseEntity<ApiTestResponse> response1 =
                    this.restTemplate.exchange(this.getUrl("/api/qa/"+id+"/question"),HttpMethod.GET,request1,ApiTestResponse.class);
            assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response1.getBody()).isNotNull();
            assertThat(response1.getBody().getMessage()).isNull();
            assertThat(response1.getBody().getData()).isNotNull();
            assertThat(response1.getBody().getData()).containsKey("title");
            assertThat(response1.getBody().getData()).containsKey("description");
        }
    }

    @Test
    @Order(9)
    void getQuestionDetailNormal(){
        for (int i = 0;i < 10;i++) {
            final var user = new TestUser("huaqiang_hzx"+i, "123456", false);
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

            final List<Map<String, ?>> orders = (List<Map<String, ?>>) response.getBody().getData().get("questions");
            String id = (String) orders.get(0).get("id");
            final HttpEntity<Map<String, ?>> request1 =
                    ApiTestRequest.build(null, user.getAccessToken());
            final ResponseEntity<ApiTestResponse> response1 =
                    this.restTemplate.exchange(this.getUrl("/api/qa/"+id+"/detail"),HttpMethod.GET,request1,ApiTestResponse.class);
            assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response1.getBody()).isNotNull();
            assertThat(response1.getBody().getMessage()).isNull();
            assertThat(response1.getBody().getData()).isNotNull();
            assertThat(response1.getBody().getData()).containsKey("title");
            assertThat(response1.getBody().getData()).containsKey("description");
            assertThat(response1.getBody().getData()).containsKey("answer");
        }
    }

    @Test
    @Order(12)
    void postRatingNormal(){
        for (int i = 0; i < 5; i++) {
            final var user = new TestUser("huaqiang_hzx" + i, "123456", false);
            user.login(this.restTemplate, this.getUrl("/api/user/login"));
            final HttpEntity<Map<String, ?>> request =
                    ApiTestRequest.build(Map.of("rating", 3),
                            user.getAccessToken());
            final HttpEntity<Map<String, ?>> request1 =
                    ApiTestRequest.build(null, user.getAccessToken());
            final ResponseEntity<ApiTestResponse> response =
                    this.restTemplate.exchange(this.getUrl("/api/user/orders?page=0&perpage=5"),HttpMethod.GET,request1,ApiTestResponse.class);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).isNull();
            assertThat(response.getBody().getData()).isNotNull();
            assertThat(response.getBody().getData()).containsKey("questions");
            assertThat(response.getBody().getData()).containsKey("count");

            final List<Map<String, ?>> orders = (List<Map<String, ?>>) response.getBody().getData().get("questions");
            String id = (String) orders.get(0).get("id");
            var foo = this.restTemplate.postForEntity(this.getUrl("/api/qa/"+id+"/rate"), request,
                    ApiTestResponse.class);
            assertThat(foo.getStatusCode()).isEqualTo(HttpStatus.OK);
        }
    }

    @Test
    @Order(10)
    void postFinishedNormal(){
        for (int i = 0; i < 5; i++) {
            final var user = new TestUser("huaqiang_hzx" + i, "123456", false);
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

            final List<Map<String, ?>> orders = (List<Map<String, ?>>) response.getBody().getData().get("questions");
            String id = (String) orders.get(0).get("id");
            var foo = this.restTemplate.postForEntity(this.getUrl("/api/qa/"+id+"/finish"), request,
                    ApiTestResponse.class);
            assertThat(foo.getStatusCode()).isEqualTo(HttpStatus.OK);
        }
    }

    @Test
    @Order(11)
    void postChatBeginNormal(){
        for (int i = 6; i < 10; i++) {
            final var user = new TestUser("huaqiang_hzx" + i, "123456", false);
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

            final List<Map<String, ?>> orders = (List<Map<String, ?>>) response.getBody().getData().get("questions");
            String id = (String) orders.get(0).get("id");
            var foo = this.restTemplate.postForEntity(this.getUrl("/api/qa/"+id+"/chat"), request,
                    ApiTestResponse.class);
            assertThat(foo.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

    }

    @Test
    @Order(12)
    void getOrderInfoInChatNormal(){
        final var user = new TestUser("huaqiang_hzx1", "123456", false);
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
                    this.restTemplate.exchange(this.getUrl("/api/user/chat/"+id+"/question"),HttpMethod.GET,request,ApiTestResponse.class);
            assertThat(response2.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response2.getBody()).isNotNull();
            assertThat(response2.getBody().getMessage()).isNull();
            assertThat(response2.getBody().getData()).isNotNull();
            assertThat(response2.getBody().getData()).containsKey("title");
            assertThat(response2.getBody().getData()).containsKey("description");
            assertThat(response2.getBody().getData()).containsKey("answer");
        } catch (Exception ignored){ }
    }

    @Test
    @Order(13)
    void getQARepoNormal(){
        final var user = new TestUser("huaqiang_hzx1", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/qa/repo?page=0&perPage=5"),HttpMethod.GET,request,ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull();
        assertThat(response.getBody().getData()).containsKey("questions");
        assertThat(response.getBody().getData()).containsKey("page");

        List<Map<String, ?>> questions = (List<Map<String, ?>>) response.getBody().getData().get("questions");
        for (Map<String, ?> question: questions) {
            assertThat(question).containsKey("title");
            assertThat(question).containsKey("description");
            assertThat(question).containsKey("id");
            assertThat(question).containsKey("answer");
        }
    }

    @Test
    @Order(14)
    void getOrderStatusNormal() {
        final var user = new TestUser("huaqiang_hzx0", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/orders?page=0&perpage=5"),HttpMethod.GET,request,ApiTestResponse.class);
        final List<Map<String, ?>> orders = (List<Map<String, ?>>) response.getBody().getData().get("questions");
        String id = (String) orders.get(0).get("id");

        final ResponseEntity<ApiTestResponse> response1 =
                this.restTemplate.exchange(this.getUrl("/api/qa/"+id+"/status"),HttpMethod.GET,request,ApiTestResponse.class);
        assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response1.getBody()).isNotNull();
        assertThat(response1.getBody().getMessage()).isNull();
        assertThat(response1.getBody().getData()).isNotNull();
        assertThat(response1.getBody().getData()).containsKey("status");
        assertThat(response1.getBody().getData().get("status")).isEqualTo(Map.of("name","FINISHED"));
    }

    @Test
    @Order(15)
    void getPublicOrderNormal() {
        final var user = new TestUser("huaqiang_hzx1", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/qa/repo?page=0&perPage=5"),HttpMethod.GET,request,ApiTestResponse.class);
        List<Map<String, ?>> questions = (List<Map<String, ?>>) response.getBody().getData().get("questions");
        String id = (String) questions.get(0).get("id");

        final ResponseEntity<ApiTestResponse> response1 =
                this.restTemplate.exchange(this.getUrl("/api/qa/"+id+"/public/detail"),HttpMethod.GET,request,ApiTestResponse.class);

        assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response1.getBody()).isNotNull();
        assertThat(response1.getBody().getMessage()).isNull();
        assertThat(response1.getBody().getData()).isNotNull();

        assertThat(response1.getBody().getData()).containsKey("title");
        assertThat(response1.getBody().getData()).containsKey("description");
        assertThat(response1.getBody().getData()).containsKey("answer");
    }

    @Test
    void getRespondentNotFound() {
        final var user = new TestUser("huaqiang_hzx0", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/qa/nobody/profile"), HttpMethod.GET, request, ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void postAnswerForFirstOrderNotFound() {
        final var user = new TestUser("haoge_hzx0", "123456", true);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));

        final HttpEntity<Map<String, ?>> request = ApiTestRequest.build(
                Map.of("content", "aba"), user.getAccessToken()
        );

        UUID id = UUID.randomUUID();
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.postForEntity(this.getUrl("/api/qa/"+id+"/response"), request,
                        ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void postAnswerForFirstBadRequest() {
        final var user = new TestUser("haoge_hzx0", "123456", true);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));

        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/questions?page=0&perpage=5"),HttpMethod.GET,request,ApiTestResponse.class);

        final List<Map<String, ?>> questions = (List<Map<String, ?>>) response.getBody().getData().get("questions");
        String id = (String) questions.get(0).get("id");

        final var user1 = new TestUser("haoge_hzx1", "123456", true);
        user1.login(this.restTemplate, this.getUrl("/api/user/login"));

        final HttpEntity<Map<String, ?>> request1 = ApiTestRequest.build(
                Map.of("content", "aba"), user1.getAccessToken()
        );

        final ResponseEntity<ApiTestResponse> response1 =
                this.restTemplate.postForEntity(this.getUrl("/api/qa/"+id+"/response"), request1,
                        ApiTestResponse.class);

        assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void acceptOrderNotFound() {
        final var user = new TestUser("haoge_hzx0", "123456", true);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));

        final HttpEntity<Map<String, ?>> request = ApiTestRequest.build(
                null, user.getAccessToken()
        );

        UUID id = UUID.randomUUID();
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.postForEntity(this.getUrl("/api/qa/"+id+"/accept"), request,
                        ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void acceptOrderBadRequest() {
        final var user = new TestUser("haoge_hzx0", "123456", true);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));

        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/questions?page=0&perpage=5"),HttpMethod.GET,request,ApiTestResponse.class);

        final List<Map<String, ?>> questions = (List<Map<String, ?>>) response.getBody().getData().get("questions");
        String id = (String) questions.get(0).get("id");

        final var user1 = new TestUser("haoge_hzx1", "123456", true);
        user1.login(this.restTemplate, this.getUrl("/api/user/login"));

        final HttpEntity<Map<String, ?>> request1 = ApiTestRequest.build(
                null, user1.getAccessToken()
        );

        final ResponseEntity<ApiTestResponse> response1 =
                this.restTemplate.postForEntity(this.getUrl("/api/qa/"+id+"/accept"), request1,
                        ApiTestResponse.class);

        assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void refuseOrderNotFound() {
        final var user = new TestUser("haoge_hzx0", "123456", true);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));

        final HttpEntity<Map<String, ?>> request = ApiTestRequest.build(
                null, user.getAccessToken()
        );

        UUID id = UUID.randomUUID();
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.postForEntity(this.getUrl("/api/qa/"+id+"/refuse"), request,
                        ApiTestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void refuseOrderBadRequest() {
        final var user = new TestUser("haoge_hzx0", "123456", true);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));

        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/questions?page=0&perpage=5"),HttpMethod.GET,request,ApiTestResponse.class);

        final List<Map<String, ?>> questions = (List<Map<String, ?>>) response.getBody().getData().get("questions");
        String id = (String) questions.get(0).get("id");

        final var user1 = new TestUser("haoge_hzx1", "123456", true);
        user1.login(this.restTemplate, this.getUrl("/api/user/login"));

        final HttpEntity<Map<String, ?>> request1 = ApiTestRequest.build(
                null, user1.getAccessToken()
        );

        final ResponseEntity<ApiTestResponse> response1 =
                this.restTemplate.postForEntity(this.getUrl("/api/qa/"+id+"/refuse"), request1,
                        ApiTestResponse.class);

        assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void postQuestionRespondentNotFound() {
        final var user = new TestUser("huaqiang_hzx0", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(Map.of("title", "关于瓜的若干问题",
                                "respondent", "nobody",
                                "description", "哥们儿，这瓜多少钱一斤那",
                                "isPublic", true),
                        user.getAccessToken());
        var foo = this.restTemplate.postForEntity(this.getUrl("/api/qa/new-question"), request,
                ApiTestResponse.class);
        assertThat(foo.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void postQuestionUserNotRespondent() {
        final var user = new TestUser("huaqiang_hzx0", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(Map.of("title", "关于瓜的若干问题",
                                "respondent", "huaqiang_hzx1",
                                "description", "哥们儿，这瓜多少钱一斤那",
                                "isPublic", true),
                        user.getAccessToken());
        var foo = this.restTemplate.postForEntity(this.getUrl("/api/qa/new-question"), request,
                ApiTestResponse.class);
        assertThat(foo.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void postQuestionNotEnoughMoney() {
        final var user = new TestUser("haoge_hzx0", "123456", true);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(Map.of("specialities",List.of("1","2"),
                                            "fee", 10,
                                            "about", "asfasdf",
                                            "detail", "qpwoiruqpwoeirqprqrio"), user.getAccessToken());
        final ResponseEntity<Object> response = this.restTemplate.postForEntity(this.getUrl("/api/user/settings/respondent"),request,Object.class);

        final var user1 = new TestUser("huaqiang_hzx0", "123456", false);
        user1.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request1 =
                ApiTestRequest.build(Map.of("title", "关于瓜的若干问题",
                                "respondent", "haoge_hzx0",
                                "description", "哥们儿，这瓜多少钱一斤那",
                                "isPublic", true),
                        user1.getAccessToken());
        var foo = this.restTemplate.postForEntity(this.getUrl("/api/qa/new-question"), request1,
                ApiTestResponse.class);
        assertThat(foo.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void getQuestionUsernameNotFound() {
        final var user = new TestUser("huaqiang_hzx0", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/qa/confirm/nobody"),HttpMethod.GET,request,ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getQuestionUserNotRespondent() {
        final var user = new TestUser("huaqiang_hzx0", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/qa/confirm/huaqiang_hzx1"),HttpMethod.GET,request,ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getQuestionContentOrderNotFound() {
        final var user = new TestUser("huaqiang_hzx0", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());

        UUID id = UUID.randomUUID();
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/qa/"+id+"/question"),HttpMethod.GET,request,ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getQuestionContentNotHisOrder() {
        final var user = new TestUser("huaqiang_hzx0", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));

        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/orders?page=0&perpage=5"),HttpMethod.GET,request,ApiTestResponse.class);

        final List<Map<String, ?>> orders = (List<Map<String, ?>>) response.getBody().getData().get("questions");
        String id = (String) orders.get(0).get("id");

        final var other = new TestUser("huaqiang_hzx1", "123456", false);
        other.login(this.restTemplate, this.getUrl("/api/user/login"));

        final HttpEntity<Map<String, ?>> request1 =
                ApiTestRequest.build(null, other.getAccessToken());
        final ResponseEntity<ApiTestResponse> response1 =
                this.restTemplate.exchange(this.getUrl("/api/qa/"+id+"/question"),HttpMethod.GET,request1,ApiTestResponse.class);
        assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void getQuestionDetailOrderNotFound() {
        final var user = new TestUser("huaqiang_hzx0", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());

        UUID id = UUID.randomUUID();
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/qa/"+id+"/detail"),HttpMethod.GET,request,ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getQuestionDetailNotHisOrder() {
        final var user = new TestUser("huaqiang_hzx0", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));

        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/orders?page=0&perpage=5"),HttpMethod.GET,request,ApiTestResponse.class);

        final List<Map<String, ?>> orders = (List<Map<String, ?>>) response.getBody().getData().get("questions");
        String id = (String) orders.get(0).get("id");

        final var other = new TestUser("huaqiang_hzx1", "123456", false);
        other.login(this.restTemplate, this.getUrl("/api/user/login"));

        final HttpEntity<Map<String, ?>> request1 =
                ApiTestRequest.build(null, other.getAccessToken());
        final ResponseEntity<ApiTestResponse> response1 =
                this.restTemplate.exchange(this.getUrl("/api/qa/"+id+"/detail"),HttpMethod.GET,request1,ApiTestResponse.class);
        assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void postRatingNotHisOrder() {
        final var user = new TestUser("huaqiang_hzx0", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));

        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/orders?page=0&perpage=5"),HttpMethod.GET,request,ApiTestResponse.class);

        final List<Map<String, ?>> orders = (List<Map<String, ?>>) response.getBody().getData().get("questions");
        String id = (String) orders.get(0).get("id");

        final var other = new TestUser("huaqiang_hzx1", "123456", false);
        other.login(this.restTemplate, this.getUrl("/api/user/login"));

        final HttpEntity<Map<String, ?>> request1 =
                ApiTestRequest.build(Map.of("rating",5), other.getAccessToken());
        final ResponseEntity<ApiTestResponse> response1 =
                this.restTemplate.postForEntity(this.getUrl("/api/qa/"+id+"/rate"),request1,ApiTestResponse.class);
        assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void postFinishedOrderNotFound() {
        final var user = new TestUser("huaqiang_hzx0", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());

        UUID id = UUID.randomUUID();
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.postForEntity(this.getUrl("/api/qa/"+id+"/finish"),request,ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void postFinishedNotHisOrder() {
        final var user = new TestUser("huaqiang_hzx0", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));

        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/orders?page=0&perpage=5"),HttpMethod.GET,request,ApiTestResponse.class);

        final List<Map<String, ?>> orders = (List<Map<String, ?>>) response.getBody().getData().get("questions");
        String id = (String) orders.get(0).get("id");

        final var other = new TestUser("huaqiang_hzx1", "123456", false);
        other.login(this.restTemplate, this.getUrl("/api/user/login"));

        final HttpEntity<Map<String, ?>> request1 =
                ApiTestRequest.build(null, other.getAccessToken());
        final ResponseEntity<ApiTestResponse> response1 =
                this.restTemplate.postForEntity(this.getUrl("/api/qa/"+id+"/finish"),request1,ApiTestResponse.class);
        assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void postChatBeginOrderNotFound() {
        final var user = new TestUser("huaqiang_hzx0", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));
        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());

        UUID id = UUID.randomUUID();
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.postForEntity(this.getUrl("/api/qa/"+id+"/chat"),request,ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void postChatBeginNotHisOrder() {
        final var user = new TestUser("huaqiang_hzx0", "123456", false);
        user.login(this.restTemplate, this.getUrl("/api/user/login"));

        final HttpEntity<Map<String, ?>> request =
                ApiTestRequest.build(null, user.getAccessToken());
        final ResponseEntity<ApiTestResponse> response =
                this.restTemplate.exchange(this.getUrl("/api/user/orders?page=0&perpage=5"),HttpMethod.GET,request,ApiTestResponse.class);

        final List<Map<String, ?>> orders = (List<Map<String, ?>>) response.getBody().getData().get("questions");
        String id = (String) orders.get(0).get("id");

        final var other = new TestUser("huaqiang_hzx1", "123456", false);
        other.login(this.restTemplate, this.getUrl("/api/user/login"));

        final HttpEntity<Map<String, ?>> request1 =
                ApiTestRequest.build(null, other.getAccessToken());
        final ResponseEntity<ApiTestResponse> response1 =
                this.restTemplate.postForEntity(this.getUrl("/api/qa/"+id+"/chat"),request1,ApiTestResponse.class);
        assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}

