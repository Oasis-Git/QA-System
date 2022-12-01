package app.brace.server.config;

import org.jetbrains.annotations.NotNull;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class WebEnvironmentConfig {
    @LocalServerPort
    private int port;

    protected String getUrl(final @NotNull String path) {
        return "http://localhost:" + this.port + path;
    }
}
