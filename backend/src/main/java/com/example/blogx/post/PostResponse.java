package com.example.blogx.post;

import java.util.List;

public class PostResponse {
    private String id;
    private String title;
    private String slug;
    private String summary;
    private String content;
    private String cover;
    private String category;
    private List<String> tags;
    private String authorId;
    private String publishedAt;
    private String updatedAt;
    private Integer views;
    private Integer likes;
    private Integer favorites;
    private Boolean featured;

    public PostResponse(String id,
                        String title,
                        String slug,
                        String summary,
                        String content,
                        String cover,
                        String category,
                        List<String> tags,
                        String authorId,
                        String publishedAt,
                        String updatedAt,
                        Integer views,
                        Integer likes,
                        Integer favorites,
                        Boolean featured) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.summary = summary;
        this.content = content;
        this.cover = cover;
        this.category = category;
        this.tags = tags;
        this.authorId = authorId;
        this.publishedAt = publishedAt;
        this.updatedAt = updatedAt;
        this.views = views;
        this.likes = likes;
        this.favorites = favorites;
        this.featured = featured;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getSlug() {
        return slug;
    }

    public String getSummary() {
        return summary;
    }

    public String getContent() {
        return content;
    }

    public String getCover() {
        return cover;
    }

    public String getCategory() {
        return category;
    }

    public List<String> getTags() {
        return tags;
    }

    public String getAuthorId() {
        return authorId;
    }

    public String getPublishedAt() {
        return publishedAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public Integer getViews() {
        return views;
    }

    public Integer getLikes() {
        return likes;
    }

    public Integer getFavorites() {
        return favorites;
    }

    public Boolean getFeatured() {
        return featured;
    }
}
