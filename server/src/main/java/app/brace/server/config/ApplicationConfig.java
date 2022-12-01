package app.brace.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource(value = "classpath:config.properties", encoding = "utf-8")
@PropertySource(value = "classpath:database.properties", encoding = "utf-8")
@PropertySource(value = "classpath:secret.properties", encoding = "utf-8")
@PropertySource(value = "classpath:socketio.properties", encoding = "utf-8")
@PropertySource(value = "classpath:static.properties", encoding = "utf-8")
public class ApplicationConfig {
}
