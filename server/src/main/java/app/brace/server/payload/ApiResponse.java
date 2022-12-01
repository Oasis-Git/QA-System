package app.brace.server.payload;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

@Getter
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private final T data;
    private final String message;

    @Contract("_ -> new")
    public static <T> @NotNull ApiResponse<T> success(final @Nullable T data) {
        return new ApiResponse<>(data, null);
    }

    @Contract("_ -> new")
    public static <T> @NotNull ApiResponse<T> failure(final @NotNull String message) {
        return new ApiResponse<>(null, message);
    }
}
