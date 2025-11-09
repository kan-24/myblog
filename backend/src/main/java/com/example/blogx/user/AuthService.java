package com.example.blogx.user;

import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserService userService;
    private final UserMapper userMapper;
    private final UserTokenMapper userTokenMapper;

    public AuthService(UserService userService, UserMapper userMapper, UserTokenMapper userTokenMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
        this.userTokenMapper = userTokenMapper;
    }

    public AuthResponse register(CreateUserRequest request) {
        UserResponse response = userService.register(request);
        String token = issueToken(response.getId());
        return new AuthResponse(response, token);
    }

    public AuthResponse login(LoginRequest request) {
        UserEntity entity = userMapper.findByEmail(request.getEmail());
        if (entity == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "邮箱或密码错误");
        }
        if (!userService.passwordMatches(request.getPassword(), entity.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "邮箱或密码错误");
        }
        UserResponse response = userService.mapToResponse(entity);
        String token = issueToken(entity.getId());
        return new AuthResponse(response, token);
    }

    public UserEntity requireAuthenticated(String authorization) {
        UserEntity user = authenticate(authorization);
        ensureActive(user);
        return user;
    }

    public UserEntity requireRole(String authorization, String requiredRole) {
        UserEntity user = requireAuthenticated(authorization);
        if (user == null || (requiredRole != null && !requiredRole.equalsIgnoreCase(user.getRole()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "无权限执行该操作");
        }
        return user;
    }

    public UserEntity authenticate(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "未提供授权信息");
        }
        String tokenValue = authorization.substring(7).trim();
        UserTokenEntity token = userTokenMapper.findByRefreshToken(tokenValue);
        if (token == null || token.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "登录已过期，请重新登录");
        }
        UserEntity entity = userMapper.findById(token.getUserId());
        if (entity == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "用户不存在");
        }
        return entity;
    }

    private void ensureActive(UserEntity user) {
        if (user.getStatus() != null && user.getStatus().equalsIgnoreCase("BANNED")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "账号已被禁用");
        }
    }

    private String issueToken(String userId) {
        String tokenValue = UUID.randomUUID().toString();
        OffsetDateTime now = OffsetDateTime.now();
        UserTokenEntity token = new UserTokenEntity(
                UUID.randomUUID().toString(),
                userId,
                tokenValue,
                now.plus(7, ChronoUnit.DAYS),
                now
        );
        userTokenMapper.insert(token);
        return tokenValue;
    }
}
