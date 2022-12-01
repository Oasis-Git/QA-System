package app.brace.server.controller;

import app.brace.server.config.WebEnvironmentConfig;
import app.brace.server.model.TestUser;
import app.brace.server.payload.ApiResponse;
import app.brace.server.payload.ApiTestRequest;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMapAdapter;

import java.io.File;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

public class UploadControllerTests extends WebEnvironmentConfig {
    @Autowired
    private TestRestTemplate restTemplate;

    @Value("${upload.static-dir}")
    private String STATIC_DIR;

    @Value("${upload.static-base-url}")
    private String STATIC_BASE_URL;

    @Value("classpath:Kinako.jpg") // nya~
    private File file;

    @Test
    @Order(0)
    void contextLoad() {
        assertThat(this.restTemplate).isNotNull();
        assertThat(this.STATIC_DIR).isNotNull();
        assertThat(Path.of(this.STATIC_DIR)).isDirectory();
        assertThat(this.STATIC_BASE_URL).isNotNull();
        assertThat(this.file).isFile()
                             .canRead();
    }

    @Test
    void postFileNormal() {
        final TestUser root = TestUser.getRoot();
        root.login(this.restTemplate, this.getUrl("/api/admin/login"));
        final HttpEntity<Map<String, ?>> request = ApiTestRequest.build(
                new MultiValueMapAdapter<>(Map.of("files",
                                                  List.of(new FileSystemResource(this.file)))),
                root.getAccessToken());
        final ResponseEntity<Response> response =
                this.restTemplate.postForEntity(this.getUrl("/api/upload"), request,
                                                UploadControllerTests.Response.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isNull();
        assertThat(response.getBody().getData()).isNotNull()
                                                .isNotEmpty()
                                                .hasSize(1);
        final Map<String, String> resource = response.getBody().getData().get(0);
        assertThat(resource).containsEntry("filename", "Kinako.jpg")
                            .containsKey("url");
        final String url = resource.get("url");
        assertThat(new File(this.STATIC_DIR + url.substring(this.STATIC_BASE_URL.length())))
                .hasSameBinaryContentAs(this.file);
    }

    private static class Response extends ApiResponse<List<Map<String, String>>> {
        private Response(final List<Map<String, String>> data, final String message) {
            super(data, message);
        }
    }
}
