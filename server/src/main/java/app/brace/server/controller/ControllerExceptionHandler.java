package app.brace.server.controller;

import app.brace.server.exception.HandledException;
import app.brace.server.payload.ApiResponse;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ControllerExceptionHandler {
    @ExceptionHandler(HandledException.class)
    public ResponseEntity<ApiResponse<?>>
    handledException(final @NotNull HandledException exception)
    {
        return ResponseEntity.status(exception.getHttpStatus())
                             .body(ApiResponse.failure(exception.getMessage()));
    }
}
