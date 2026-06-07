package cl.worellana.users_ms.service;

import cl.worellana.users_ms.model.AppUser;

import java.util.UUID;

public interface JwtService {
    String generateToken(AppUser user);
    UUID extractUserId(String token);
    long getExpirationSeconds();
}
