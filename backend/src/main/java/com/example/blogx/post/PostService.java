package com.example.blogx.post;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

        return buildResponse(entity, request.getTags());
    }

    public List<PostResponse> findAll() {
        return postMapper.findAll().stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    public PostResponse update(String id, UpdatePostRequest request) {
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

        postMapper.update(entity);

        return buildResponse(entity, request.getTags());
    }

    public PostResponse toggleLike(String id, ToggleLikeRequest request) {
        PostEntity entity = postMapper.findById(id);
        if (entity == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }

        int currentLikes = entity.getLikes() != null ? entity.getLikes() : 0;
        int delta = Boolean.TRUE.equals(request.getLiked()) ? 1 : -1;
        int updatedLikes = Math.max(0, currentLikes + delta);

        postMapper.updateLikes(id, updatedLikes);
        entity.setLikes(updatedLikes);

        return mapEntityToResponse(entity);
    }

    public void delete(String id) {
        PostEntity entity = postMapper.findById(id);
        if (entity == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }
        postMapper.delete(id);
    }

    private PostResponse mapEntityToResponse(PostEntity entity) {
        return buildResponse(entity, parseTags(entity.getTagsCsv()));
    }

    private List<String> parseTags(String tagsCsv) {
        if (tagsCsv == null || tagsCsv.isBlank()) {
            return Collections.emptyList();
        }
        return Arrays.stream(tagsCsv.split(","))
                .map(String::trim)
                .filter(tag -> !tag.isEmpty())
                .collect(Collectors.toList());
    }

    private PostResponse buildResponse(PostEntity entity, List<String> tags) {
        return new PostResponse(
                entity.getId(),
                entity.getTitle(),
                entity.getSlug(),
                entity.getSummary(),
                entity.getContent(),
                entity.getCover(),
                entity.getCategory(),
                tags,
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
