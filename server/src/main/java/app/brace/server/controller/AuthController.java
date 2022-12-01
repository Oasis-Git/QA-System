package app.brace.server.controller;

import app.brace.server.model.GroupName;
import app.brace.server.model.RoleName;
import app.brace.server.payload.ApiResponse;
import app.brace.server.security.AuthPrincipal;
import app.brace.server.security.JwtProvider;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.validation.constraints.NotBlank;
import java.util.Map;

@AllArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;

    ResponseEntity<ApiResponse<?>>
    login(final @NotNull LoginRequest request, final @NotNull RoleName roleSuper)
    {
        final Authentication authentication = this.authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.usernameWithGroupSuffix(roleSuper.getGroupName()),
                        request.password()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        final String token = this.jwtProvider.generateToken(authentication);
        final boolean isSuper =
                (((AuthPrincipal) authentication.getPrincipal()).getRoleName() == roleSuper);
        return ResponseEntity.ok(ApiResponse.success(Map.of("token", token,
                                                            "isSuper", isSuper)));
    }

    ResponseEntity<ApiResponse<?>>
    getIsSuper(final @NotNull RoleName roleSuper,
               @AuthenticationPrincipal final @NotNull AuthPrincipal currentUser)
    {
        boolean isSuper = (currentUser.getRoleName() == roleSuper);
        return ResponseEntity.ok(ApiResponse.success(Map.of("isSuper", isSuper)));
    }

    static record LoginRequest(@NotBlank String username,
                               @NotBlank String password)
    {
        @NotNull String usernameWithGroupSuffix(final @NotNull GroupName groupName) {
            return GroupName.withGroupSuffix(this.username(), groupName);
        }
    }
}
