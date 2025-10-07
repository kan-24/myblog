package com.example.blogx.post;

import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class PostService {

    private final PostMapper postMapper;

    public PostService(PostMapper postMapper) {
        this.postMapper = postMapper;
    }

    public PostResponse create(CreatePostRequest request) {
        String id = request.getId() != null && !request.getId().isBlank()
                ? request.getId()
                : UUID.randomUUID().toString();

        PostEntity entity = new PostEntity(
                id,
                request.getTitle(),
                request.getSlug(),
                request.getSummary(),
                request.getContent(),
                request.getCover(),
                request.getCategory(),
                String.join(",", request.getTags()),
                request.getAuthorId(),
                request.getPublishedAt(),
                request.getUpdatedAt(),
                request.getViews(),
                request.getLikes(),
                request.getFavorites(),
                request.getFeatured()
        );

        postMapper.insert(entity);

        return new PostResponse(
                entity.getId(),
                entity.getTitle(),
                entity.getSlug(),
                entity.getSummary(),
                entity.getContent(),
                entity.getCover(),
                entity.getCategory(),
                request.getTags(),
                entity.getAuthorId(),
                entity.getPublishedAt(),
                entity.getUpdatedAt(),
                entity.getViews(),
                entity.getLikes(),
                entity.getFavorites(),
                entity.getFeatured()
        );
    }
}
