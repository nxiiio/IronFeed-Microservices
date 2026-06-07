package cl.worellana.users_ms.exception;

public class InvalidTokenException extends RuntimeException {
    public InvalidTokenException() {
        super("Token inválido o ausente");
    }
}
