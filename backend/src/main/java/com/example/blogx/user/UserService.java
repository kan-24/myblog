package com.example.blogx.user;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UserService {

    private static final String DEFAULT_ROLE = "author";

    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public List<UserResponse> findAll() {
        return userMapper.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UserResponse register(CreateUserRequest request) {
        UserEntity existing = userMapper.findByEmail(request.getEmail());
        if (existing != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "邮箱已注册");
        }

        String roleId = userMapper.findRoleIdByName(DEFAULT_ROLE);
        if (roleId == null) {
            roleId = UUID.randomUUID().toString();
            userMapper.insertRole(roleId, DEFAULT_ROLE, "Default author role");
        }

        OffsetDateTime now = OffsetDateTime.now();
        UserEntity entity = new UserEntity(
                UUID.randomUUID().toString(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getName(),
                null,
                "ACTIVE",
                null,
                now,
                now,
                DEFAULT_ROLE
        );

        userMapper.insert(entity);
        userMapper.insertUserRole(entity.getId(), roleId);

        return mapToResponse(entity);
    }

    public boolean passwordMatches(String rawPassword, String hashed) {
        return passwordEncoder.matches(rawPassword, hashed);
    }

    public UserResponse mapToResponse(UserEntity entity) {
        String role = entity.getRole() != null ? entity.getRole() : DEFAULT_ROLE;
        return new UserResponse(
                entity.getId(),
                entity.getName(),
                entity.getEmail(),
                role,
                entity.getAvatarUrl(),
                entity.getStatus(),
                entity.getLastLoginAt() != null ? entity.getLastLoginAt().toString() : null,
                "zh-CN",
                entity.getCreatedAt() != null ? entity.getCreatedAt().toString() : null,
                entity.getUpdatedAt() != null ? entity.getUpdatedAt().toString() : null
        );
    }
}
