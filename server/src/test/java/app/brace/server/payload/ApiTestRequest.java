package app.brace.server.payload;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.MultiValueMap;

import java.util.Map;

public class ApiTestRequest {
    public static @NotNull HttpEntity<Map<String, ?>> build(final @Nullable Map<String, ?> body) {
        return ApiTestRequest.build(body, null);
    }

    public static @NotNull HttpEntity<Map<String, ?>> build(final @Nullable Map<String, ?> body,
                                                            final @Nullable String accessToken)
    {
        final var headers = new HttpHeaders();
        headers.setContentType(body instanceof MultiValueMap ?
                                       MediaType.MULTIPART_FORM_DATA :
                                       MediaType.APPLICATION_JSON);
        if (accessToken != null) {
            headers.setBearerAuth(accessToken.substring("Bearer ".length()));
        }
        return new HttpEntity<>(body, headers);
    }
}
