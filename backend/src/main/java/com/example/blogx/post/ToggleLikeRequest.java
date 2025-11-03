package com.example.blogx.post;

import jakarta.validation.constraints.NotNull;

public class ToggleLikeRequest {

    @NotNull
    private Boolean liked;

    public Boolean getLiked() {
        return liked;
    }

    public void setLiked(Boolean liked) {
        this.liked = liked;
    }
}
