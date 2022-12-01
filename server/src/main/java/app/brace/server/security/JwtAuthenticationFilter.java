package app.brace.server.security;

import app.brace.server.exception.HandleableException;
import app.brace.server.exception.HandledException;
import app.brace.server.model.GroupName;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@AllArgsConstructor
@Service
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtProvider jwtProvider;
    private final AuthPrincipalService authPrincipalService;

    @Override
    protected void doFilterInternal(final @NotNull HttpServletRequest request,
                                    final @NotNull HttpServletResponse response,
                                    final @NotNull FilterChain filterChain)
            throws ServletException, IOException
    {
        final String token = request.getHeader("Authorization");
        final String usernameWithGroupSuffix = this.jwtProvider.getUsernameWithGroupSuffix(token);
        if (usernameWithGroupSuffix != null) {
            final AuthPrincipal authPrincipal;
            try {
                authPrincipal =
                        this.authPrincipalService.loadUserByUsername(usernameWithGroupSuffix);
            } catch (final UsernameNotFoundException exception) {
                final HandledException handledException = new HandleableException(
                        "用户 `%s` 不存在.".formatted(
                                GroupName.withoutGroupSuffix(usernameWithGroupSuffix)
                        ), exception, AuthPrincipalService.class
                ).handle(HttpStatus.UNAUTHORIZED, JwtAuthenticationFilter.class);
                JwtAuthenticationFilter.handleException(handledException, response);
                return;
            }
            final var authentication = new UsernamePasswordAuthenticationToken(authPrincipal, null,
                                                                               authPrincipal.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);
    }

    private static void handleException(final @NotNull HandledException exception,
                                        final @NotNull HttpServletResponse response)
    {
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(exception.getHttpStatus().value());
        try {
            response.getOutputStream()
                    .write("{\"message\": \"%s\"}".formatted(exception.getMessage())
                                                  .getBytes(StandardCharsets.UTF_8));
        } catch (final IOException e) {
            e.printStackTrace(); // TODO
        }
    }
}
