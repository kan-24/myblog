package com.example.blogx.user;

public class UserResponse {
    private final String id;
    private final String name;
    private final String email;
    private final String role;
    private final String avatarUrl;
    private final String status;
    private final String lastLoginAt;
    private final String language;
    private final String createdAt;
    private final String updatedAt;

    public UserResponse(
            String id,
            String name,
            String email,
            String role,
            String avatarUrl,
            String status,
            String lastLoginAt,
            String language,
            String createdAt,
            String updatedAt
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.avatarUrl = avatarUrl;
        this.status = status;
        this.lastLoginAt = lastLoginAt;
        this.language = language;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public String getStatus() {
        return status;
    }

    public String getLastLoginAt() {
        return lastLoginAt;
    }

    public String getLanguage() {
        return language;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }
}
