package com.example.blogx.post;

public class PostEntity {
    private String id;
    private String title;
    private String slug;
    private String summary;
    private String content;
    private String cover;
    private String category;
    private String tagsCsv;
    private String authorId;
    private String publishedAt;
    private String updatedAt;
    private Integer views;
    private Integer likes;
    private Integer favorites;
    private Boolean featured;

    public PostEntity() {
    }

    public PostEntity(String id,
                      String title,
                      String slug,
                      String summary,
                      String content,
                      String cover,
                      String category,
                      String tagsCsv,
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
        this.tagsCsv = tagsCsv;
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

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCover() {
        return cover;
    }

    public void setCover(String cover) {
        this.cover = cover;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTagsCsv() {
        return tagsCsv;
    }

    public void setTagsCsv(String tagsCsv) {
        this.tagsCsv = tagsCsv;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public String getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(String publishedAt) {
        this.publishedAt = publishedAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Integer getViews() {
        return views;
    }

    public void setViews(Integer views) {
        this.views = views;
    }

    public Integer getLikes() {
        return likes;
    }

    public void setLikes(Integer likes) {
        this.likes = likes;
    }

    public Integer getFavorites() {
        return favorites;
    }

    public void setFavorites(Integer favorites) {
        this.favorites = favorites;
    }

    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }
}
