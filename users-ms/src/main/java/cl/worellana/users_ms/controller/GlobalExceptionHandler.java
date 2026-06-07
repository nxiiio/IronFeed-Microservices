package cl.worellana.users_ms.controller;

import cl.worellana.users_ms.exception.EmailAlreadyExistsException;
import cl.worellana.users_ms.exception.InvalidCredentialsException;
import cl.worellana.users_ms.exception.InvalidTokenException;
import cl.worellana.users_ms.exception.UsernameAlreadyExistsException;
import cl.worellana.users_ms.model.dto.ExceptionResponse;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleNotFound(EntityNotFoundException ex, HttpServletRequest req) {
        return build(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", ex.getMessage(), req, null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        Map<String, String> fields = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(fe -> fields.put(fe.getField(), fe.getDefaultMessage()));
        return build(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", "Datos de entrada inválidos", req, fields);
    }

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<ExceptionResponse> handleUsernameExists(UsernameAlreadyExistsException ex, HttpServletRequest req) {
        return build(HttpStatus.CONFLICT, "USERNAME_ALREADY_EXISTS", "El recurso ya existe", req, Map.of("username", ex.getMessage()));
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ExceptionResponse> handleEmailExists(EmailAlreadyExistsException ex, HttpServletRequest req) {
        return build(HttpStatus.CONFLICT, "EMAIL_ALREADY_EXISTS", "El recurso ya existe", req, Map.of("email", ex.getMessage()));
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ExceptionResponse> handleInvalidCredentials(InvalidCredentialsException ex, HttpServletRequest req) {
        return build(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", ex.getMessage(), req, null);
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ExceptionResponse> handleInvalidToken(InvalidTokenException ex, HttpServletRequest req) {
        return build(HttpStatus.UNAUTHORIZED, "INVALID_TOKEN", ex.getMessage(), req, null);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ExceptionResponse> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex, HttpServletRequest req) {
        String requiredType = ex.getRequiredType() != null
                ? ex.getRequiredType().getSimpleName()
                : "valor válido";
        String message = "El valor '" + ex.getValue() + "' no es un " + requiredType + " válido";
        return build(HttpStatus.BAD_REQUEST, "INVALID_PARAMETER", "Parámetro inválido", req,
                Map.of(ex.getName(), message));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ExceptionResponse> handleConflict(DataIntegrityViolationException ex, HttpServletRequest req) {
        return build(HttpStatus.CONFLICT, "DATA_INTEGRITY_VIOLATION", "Violación de integridad de datos", req, null);
    }

    @ExceptionHandler({NoHandlerFoundException.class, NoResourceFoundException.class})
    public ResponseEntity<ExceptionResponse> handleRouteNotFound(Exception ex, HttpServletRequest req) {
        return build(HttpStatus.NOT_FOUND, "ROUTE_NOT_FOUND", "No se encontró el recurso solicitado", req, null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponse> handleGeneric(Exception ex, HttpServletRequest req) {
        InvalidCredentialsException invalidCredentialsException = findCause(ex, InvalidCredentialsException.class);
        if (invalidCredentialsException != null) {
            return handleInvalidCredentials(invalidCredentialsException, req);
        }

        InvalidTokenException invalidTokenException = findCause(ex, InvalidTokenException.class);
        if (invalidTokenException != null) {
            return handleInvalidToken(invalidTokenException, req);
        }

        UsernameAlreadyExistsException usernameAlreadyExistsException =
                findCause(ex, UsernameAlreadyExistsException.class);
        if (usernameAlreadyExistsException != null) {
            return handleUsernameExists(usernameAlreadyExistsException, req);
        }

        EmailAlreadyExistsException emailAlreadyExistsException = findCause(ex, EmailAlreadyExistsException.class);
        if (emailAlreadyExistsException != null) {
            return handleEmailExists(emailAlreadyExistsException, req);
        }

        logger.error("unhandled_exception path={}", req.getRequestURI(), ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", "Error interno del servidor", req, null);
    }

    private ResponseEntity<ExceptionResponse> build(HttpStatus status, String code, String message,
            HttpServletRequest req, Map<String, String> fieldErrors) {
        ExceptionResponse body = ExceptionResponse.builder()
                .status(status.value())
                .error(code)
                .message(message)
                .path(req.getRequestURI())
                .fieldErrors(fieldErrors)
                .build();
        return ResponseEntity.status(status).body(body);
    }

    private <T extends Throwable> T findCause(Throwable throwable, Class<T> expectedType) {
        Throwable current = throwable;
        while (current != null) {
            if (expectedType.isInstance(current)) {
                return expectedType.cast(current);
            }
            current = current.getCause();
        }
        return null;
    }
}
