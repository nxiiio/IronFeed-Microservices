package cl.worellana.users_ms.service;

import cl.worellana.users_ms.model.dto.AppUserRequest;
import cl.worellana.users_ms.model.dto.AppUserResponse;
import cl.worellana.users_ms.model.dto.LoginRequest;
import cl.worellana.users_ms.model.dto.LoginResponse;

public interface AuthService {
    AppUserResponse register(AppUserRequest request);
    LoginResponse login(LoginRequest request);
    AppUserResponse me(String authorizationHeader);
}
