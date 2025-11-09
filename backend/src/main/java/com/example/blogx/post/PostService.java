package com.example.blogx.post;

import java.time.OffsetDateTime;
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
    private final PostLikeMapper postLikeMapper;

    public PostService(PostMapper postMapper, PostLikeMapper postLikeMapper) {
        this.postMapper = postMapper;
        this.postLikeMapper = postLikeMapper;
    }

    public PostResponse create(CreatePostRequest request) {
        String id = request.getId() != null && !request.getId().isBlank()
                ? request.getId()
                : UUID.randomUUID().toString();

        OffsetDateTime now = OffsetDateTime.now();
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
                request.getPublishedAt() != null ? request.getPublishedAt() : now.toString(),
                request.getUpdatedAt() != null ? request.getUpdatedAt() : now.toString(),
                request.getViews() != null ? request.getViews() : 0,
                request.getLikes() != null ? request.getLikes() : 0,
                request.getFavorites() != null ? request.getFavorites() : 0,
                request.getFeatured() != null ? request.getFeatured() : Boolean.FALSE
        );

        postMapper.insert(entity);

        return buildResponse(entity, request.getTags());
    }

    public List<PostResponse> findAll(int page, int size) {
        int safePage = Math.max(page, 1);
        int safeSize = Math.min(Math.max(size, 1), 50);
        int offset = (safePage - 1) * safeSize;
        return postMapper.findAll(safeSize, offset).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    public PostResponse findById(String id) {
        PostEntity entity = postMapper.findById(id);
        if (entity == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "文章不存在");
        }
        return mapEntityToResponse(entity);
    }

    public PostResponse update(String id, UpdatePostRequest request) {
        PostEntity existing = postMapper.findById(id);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "文章不存在");
        }

        PostEntity entity = new PostEntity(
                id,
                request.getTitle(),
                request.getSlug(),
                request.getSummary(),
                request.getContent(),
                request.getCover(),
                request.getCategory(),
                String.join(",", request.getTags()),
                existing.getAuthorId(),
                existing.getPublishedAt(),
                OffsetDateTime.now().toString(),
                request.getViews() != null ? request.getViews() : existing.getViews(),
                request.getLikes() != null ? request.getLikes() : existing.getLikes(),
                request.getFavorites() != null ? request.getFavorites() : existing.getFavorites(),
                request.getFeatured() != null ? request.getFeatured() : existing.getFeatured()
        );

        postMapper.update(entity);

        return buildResponse(entity, request.getTags());
    }

    public PostResponse like(String id, String userId) {
        PostEntity entity = requirePost(id);
        if (postLikeMapper.exists(id, userId)) {
            return mapEntityToResponse(entity);
        }
        postLikeMapper.insert(id, userId, OffsetDateTime.now());
        postMapper.adjustLikes(id, 1);
        entity.setLikes((entity.getLikes() != null ? entity.getLikes() : 0) + 1);
        return mapEntityToResponse(entity);
    }

    public PostResponse unlike(String id, String userId) {
        PostEntity entity = requirePost(id);
        if (!postLikeMapper.exists(id, userId)) {
            return mapEntityToResponse(entity);
        }
        postLikeMapper.delete(id, userId);
        postMapper.adjustLikes(id, -1);
        entity.setLikes(Math.max(0, (entity.getLikes() != null ? entity.getLikes() : 0) - 1));
        return mapEntityToResponse(entity);
    }

    public void delete(String id) {
        PostEntity entity = requirePost(id);
        postMapper.delete(entity.getId());
    }

    private PostEntity requirePost(String id) {
        PostEntity entity = postMapper.findById(id);
        if (entity == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "文章不存在");
        }
        return entity;
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
