package app.brace.server.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordEncoder extends BCryptPasswordEncoder {
    public PasswordEncoder() {
        super(BCryptVersion.$2B, 12);
    }
}
