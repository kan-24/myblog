package com.example.blogx.user;

public class AuthResponse {

    private final UserResponse user;
    private final String token;

    public AuthResponse(UserResponse user, String token) {
        this.user = user;
        this.token = token;
    }

    public UserResponse getUser() {
        return user;
    }

    public String getToken() {
        return token;
    }
}
