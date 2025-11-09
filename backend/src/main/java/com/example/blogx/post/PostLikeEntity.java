package com.example.blogx.post;

import java.time.OffsetDateTime;

public class PostLikeEntity {
    private String postId;
    private String userId;
    private OffsetDateTime createdAt;

    public PostLikeEntity() {
    }

    public PostLikeEntity(String postId, String userId, OffsetDateTime createdAt) {
        this.postId = postId;
        this.userId = userId;
        this.createdAt = createdAt;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
