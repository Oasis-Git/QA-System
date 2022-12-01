package app.brace.server;

import app.brace.server.config.ApplicationTestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;

@SpringBootTest
@ContextConfiguration(classes = ApplicationTestConfig.class)
class BraceServerApplicationTests {
    @Test
    void contextLoads() {}
}
