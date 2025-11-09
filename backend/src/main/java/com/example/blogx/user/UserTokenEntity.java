package com.example.blogx.user;

import java.time.OffsetDateTime;

public class UserTokenEntity {
    private String id;
    private String userId;
    private String refreshToken;
    private OffsetDateTime expiresAt;
    private OffsetDateTime createdAt;

    public UserTokenEntity() {
    }

    public UserTokenEntity(String id, String userId, String refreshToken, OffsetDateTime expiresAt, OffsetDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.refreshToken = refreshToken;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public OffsetDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(OffsetDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
