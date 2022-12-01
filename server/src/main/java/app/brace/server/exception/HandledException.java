package app.brace.server.exception;

import app.brace.server.controller.ControllerExceptionHandler;
import lombok.Getter;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;

/**
 * {@code HandledException} 的语义为：异常被 server 处理完成，
 * 需要以 response 的形式反馈至 client.
 * 因此，一旦语境确定，就应该对 {@link HandleableException} 进行处理。
 * {@code HandledException} 应该仅由 {@link ControllerExceptionHandler} 处理。
 */
@Getter
public class HandledException extends RuntimeException {
    private final HttpStatus httpStatus;

    public HandledException(final @NotNull String message, final @NotNull HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }
}
