package com.example.blogx.comment;

public class CommentResponse {
    private final String id;
    private final String postId;
    private final String authorId;
    private final String parentId;
    private final String content;
    private final String status;
    private final String createdAt;
    private final String updatedAt;

    public CommentResponse(String id, String postId, String authorId, String parentId, String content, String status,
                           String createdAt, String updatedAt) {
        this.id = id;
        this.postId = postId;
        this.authorId = authorId;
        this.parentId = parentId;
        this.content = content;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() {
        return id;
    }

    public String getPostId() {
        return postId;
    }

    public String getAuthorId() {
        return authorId;
    }

    public String getParentId() {
        return parentId;
    }

    public String getContent() {
        return content;
    }

    public String getStatus() {
        return status;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }
}
