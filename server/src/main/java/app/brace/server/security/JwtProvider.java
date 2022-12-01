package app.brace.server.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.KeyPair;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Component
public class JwtProvider {
    private static final String PREFIX = "Bearer";

    private final KeyPair keyPair;
    private final Date startedAt;

    @Value("${jwt-provider.name}")
    private String name;

    @Value("${jwt-provider.expiration-ms}")
    private int expirationMs;

    public JwtProvider() {
        this.keyPair = Keys.keyPairFor(SignatureAlgorithm.ES512);
        this.startedAt = new Date();
        JwtProvider.log.info("Using private key: " +
                             Encoders.BASE64.encode(this.keyPair.getPrivate().getEncoded()));
        JwtProvider.log.info("Using public key: " +
                             Encoders.BASE64.encode(this.keyPair.getPublic().getEncoded()));
    }

    public String generateToken(final @NotNull Authentication authentication) {
        final var authPrincipal = (AuthPrincipal) authentication.getPrincipal();
        final Date now = new Date();
        final Date expiry = new Date(now.getTime() + this.expirationMs);
        final String token = Jwts.builder()
                                 .setIssuer(this.name)
                                 .setSubject(authPrincipal.getUsername())
                                 .setAudience(this.name)
                                 .setExpiration(expiry)
                                 .setNotBefore(this.startedAt)
                                 .setIssuedAt(now)
                                 .setId(UUID.randomUUID().toString())
                                 .signWith(this.keyPair.getPrivate())
                                 .compact();
        return JwtProvider.PREFIX + ' ' + token;
    }

    public @Nullable String getUsernameWithGroupSuffix(final String token) {
        if (token == null || !token.startsWith(JwtProvider.PREFIX)) {
            return null;
        }
        final Claims claims = Jwts.parserBuilder()
                                  .requireAudience(this.name)
                                  .requireIssuer(this.name)
                                  .requireNotBefore(this.startedAt)
                                  .setSigningKey(this.keyPair.getPublic())
                                  .build()
                                  .parseClaimsJws(token.substring(JwtProvider.PREFIX.length()))
                                  .getBody();
        // TODO 异常处理：parseClaimsJws
        return claims.getSubject(); // TODO: null
    }
}
