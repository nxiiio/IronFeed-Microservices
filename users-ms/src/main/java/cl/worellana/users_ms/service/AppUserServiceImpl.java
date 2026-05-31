package cl.worellana.users_ms.service;

import cl.worellana.users_ms.model.AppUser;
import cl.worellana.users_ms.model.dto.AppUserProfileRequest;
import cl.worellana.users_ms.model.dto.AppUserResponse;
import cl.worellana.users_ms.repository.AppUserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AppUserServiceImpl implements AppUserService {

    private final AppUserRepository appUserRepository;

    public AppUserServiceImpl(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AppUserResponse findById(UUID id) {
        return appUserRepository.findById(id)
                .map(AppUserResponse::from)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public AppUserResponse findByUsername(String username) {
        return appUserRepository.findByUsername(username)
                .map(AppUserResponse::from)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + username));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppUserResponse> findAllById(List<UUID> ids) {
        return appUserRepository.findAllById(ids.stream().distinct().toList()).stream()
                .map(AppUserResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppUserResponse> findAll() {
        return appUserRepository.findAll().stream()
                .map(AppUserResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public AppUserResponse updateProfile(UUID id, AppUserProfileRequest request) {
        AppUser user = appUserRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + id));
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getLastname() != null) {
            user.setLastname(request.getLastname());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        return AppUserResponse.from(user);
    }
}
