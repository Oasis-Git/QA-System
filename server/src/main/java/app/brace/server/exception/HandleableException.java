package app.brace.server.exception;

import lombok.Getter;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;

/**
 * 对于 request 产生的，可识别、意料之中的、可处理的异常，
 * 均应将其转为 {@code HandleableException}，
 * 待可确定 status code 时，转换为 {@link HandledException}.
 */
@Getter
public class HandleableException extends Exception { // Exception 显式要求被处理
    private final Class<?> thrower;

    public HandleableException(final @NotNull String message,
                               final @Nullable Throwable cause,
                               final @NotNull Class<?> thrower)
    {
        super(message, cause);
        this.thrower = thrower;
    }

    public HandledException handle(final @NotNull HttpStatus httpStatus,
                                   final @NotNull Class<?> handler)
    {
        final Logger logger = LoggerFactory.getLogger(handler);
        final String log = "Handled exception threw by `%s`:".formatted(this.getThrower().getName())
                           + "\n  " + this.getMessage()
                           + '\n' + "Responded with %d.".formatted(httpStatus.value());
        logger.info(log, this.getCause());
        return new HandledException(this.getMessage(), httpStatus);
    }
}
