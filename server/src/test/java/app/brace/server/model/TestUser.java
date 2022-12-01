package app.brace.server.model;

import app.brace.server.payload.ApiTestRequest;
import app.brace.server.payload.ApiTestResponse;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@Getter
@RequiredArgsConstructor
public class TestUser {
    private static TestUser root;

    private final String username;
    private final String password;
    private final boolean isSuper;

    private String accessToken;

    public static TestUser getRoot() {
        assertThat(TestUser.root).isNotNull();
        return TestUser.root;
    }

    // 论 Spring 的依赖注入有多反人类...
    public void login(final @NotNull TestRestTemplate restTemplate, final @NotNull String url) {
        final HttpEntity<Map<String, ?>> request = ApiTestRequest.build(
                Map.of("username", this.getUsername(),
                       "password", this.getPassword())
        );
        final ResponseEntity<ApiTestResponse> response =
                restTemplate.postForEntity(url, request, ApiTestResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull()
                                                .containsKey("token")
                                                .containsKey("isSuper");
        assertThat(response.getBody().getData().get("token")).isInstanceOf(String.class);
        this.accessToken = (String) response.getBody().getData().get("token");
        assertThat(response.getBody().getData().get("isSuper")).isInstanceOf(Boolean.class);
        assertThat(response.getBody().getData().get("isSuper")).isEqualTo(this.isSuper);
    }

    @Component
    private static class RootLoader {
        @Value("${admin.root-username}")
        private String username;

        @Value("${admin.root-password}")
        private String password;

        @PostConstruct
        private void load() {
            assertThat(this.username).isNotNull();
            assertThat(this.password).isNotNull();
            TestUser.root = new TestUser(this.username, this.password, true);
        }
    }
}
