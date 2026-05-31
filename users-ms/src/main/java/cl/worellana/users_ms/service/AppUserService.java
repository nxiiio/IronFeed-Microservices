package cl.worellana.users_ms.service;

import cl.worellana.users_ms.model.dto.AppUserProfileRequest;
import cl.worellana.users_ms.model.dto.AppUserResponse;

import java.util.List;
import java.util.UUID;

public interface AppUserService {
    AppUserResponse findById(UUID id);
    AppUserResponse findByUsername(String username);
    List<AppUserResponse> findAllById(List<UUID> ids);
    List<AppUserResponse> findAll();
    AppUserResponse updateProfile(UUID id, AppUserProfileRequest request);
}
