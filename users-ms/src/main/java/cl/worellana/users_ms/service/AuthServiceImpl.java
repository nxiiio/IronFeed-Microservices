package cl.worellana.users_ms.service;

import cl.worellana.users_ms.exception.EmailAlreadyExistsException;
import cl.worellana.users_ms.exception.InvalidCredentialsException;
import cl.worellana.users_ms.exception.InvalidTokenException;
import cl.worellana.users_ms.exception.UsernameAlreadyExistsException;
import cl.worellana.users_ms.model.AppUser;
import cl.worellana.users_ms.model.dto.AppUserRequest;
import cl.worellana.users_ms.model.dto.AppUserResponse;
import cl.worellana.users_ms.model.dto.LoginRequest;
import cl.worellana.users_ms.model.dto.LoginResponse;
import cl.worellana.users_ms.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private static final String BEARER_PREFIX = "Bearer ";

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional
    public AppUserResponse register(AppUserRequest request) {
        if (appUserRepository.existsByUsername(request.getUsername())) {
            throw new UsernameAlreadyExistsException();
        }
        if (appUserRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException();
        }

        AppUser saved = appUserRepository.save(AppUser.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .lastname(request.getLastname())
                .bio(request.getBio())
                .build());

        return AppUserResponse.from(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        AppUser user = appUserRepository
                .findByEmail(request.getEmail())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        return LoginResponse.builder()
                .accessToken(jwtService.generateToken(user))
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpirationSeconds())
                .user(AppUserResponse.from(user))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AppUserResponse me(String authorizationHeader) {
        UUID userId = jwtService.extractUserId(extractToken(authorizationHeader));
        return appUserRepository.findById(userId)
                .map(AppUserResponse::from)
                .orElseThrow(InvalidTokenException::new);
    }

    private String extractToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith(BEARER_PREFIX)) {
            throw new InvalidTokenException();
        }
        return authorizationHeader.substring(BEARER_PREFIX.length());
    }
}
