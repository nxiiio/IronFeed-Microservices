package cl.worellana.users_ms.controller;

import cl.worellana.users_ms.model.dto.AppUserProfileRequest;
import cl.worellana.users_ms.model.dto.AppUserResponse;
import cl.worellana.users_ms.model.dto.UserSummaryResponse;
import cl.worellana.users_ms.service.AppUserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class AppUserController {

    private final AppUserService appUserService;

    public AppUserController(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

    @GetMapping
    public ResponseEntity<List<AppUserResponse>> findAll(
            @RequestParam(required = false) List<UUID> ids,
            @RequestParam(required = false) String username) {
        if (ids != null) {
            return ResponseEntity.ok(appUserService.findAllById(ids));
        }
        if (username != null) {
            return ResponseEntity.ok(List.of(appUserService.findByUsername(username)));
        }
        return ResponseEntity.ok(appUserService.findAll());
    }

    @GetMapping("/summaries")
    public ResponseEntity<List<UserSummaryResponse>> findSummaries(@RequestParam List<UUID> ids) {
        return ResponseEntity.ok(appUserService.findSummariesById(ids));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppUserResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(appUserService.findById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AppUserResponse> updateProfile(@PathVariable UUID id,
                                                         @Valid @RequestBody AppUserProfileRequest request) {
        return ResponseEntity.ok(appUserService.updateProfile(id, request));
    }
}
