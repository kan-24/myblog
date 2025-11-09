package com.example.blogx.comment;

import com.example.blogx.post.PostEntity;
import com.example.blogx.post.PostMapper;
import com.example.blogx.user.UserEntity;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CommentService {

    private static final int MAX_CONTENT_LENGTH = 2000;
    private static final Duration COMMENT_COOLDOWN = Duration.ofSeconds(2);
    private static final String STATUS_VISIBLE = "VISIBLE";
    private static final String STATUS_HIDDEN = "HIDDEN";

    private final CommentMapper commentMapper;
    private final PostMapper postMapper;
    private final Map<String, OffsetDateTime> lastCommentTimes = new ConcurrentHashMap<>();

    public CommentService(CommentMapper commentMapper, PostMapper postMapper) {
        this.commentMapper = commentMapper;
        this.postMapper = postMapper;
    }

    public CommentResponse create(String postId, CreateCommentRequest request, UserEntity author) {
        PostEntity post = requirePost(postId);
        validateUserStatus(author);
        String content = sanitizeContent(request.getContent());
        enforceRateLimit(author.getId());

        String parentId = request.getParentId();
        if (parentId != null && !parentId.isBlank()) {
            CommentEntity parent = commentMapper.findById(parentId);
            if (parent == null || !parent.getPostId().equals(post.getId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "无效的回复目标");
            }
        } else {
            parentId = null;
        }

        OffsetDateTime now = OffsetDateTime.now();
        CommentEntity entity = new CommentEntity(
                UUID.randomUUID().toString(),
                post.getId(),
                author.getId(),
                parentId,
                content,
                STATUS_VISIBLE,
                now,
                now
        );
        commentMapper.insert(entity);
        lastCommentTimes.put(author.getId(), now);
        return mapToResponse(entity);
    }

    public List<CommentResponse> list(String postId, int page, int size) {
        PostEntity post = requirePost(postId);
        int safePage = Math.max(page, 1);
        int safeSize = Math.min(Math.max(size, 1), 100);
        int offset = (safePage - 1) * safeSize;
        return commentMapper.findByPost(post.getId(), safeSize, offset).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CommentResponse updateStatus(String commentId, String status) {
        CommentEntity existing = commentMapper.findById(commentId);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "评论不存在");
        }
        String normalized = normalizeStatus(status);
        OffsetDateTime now = OffsetDateTime.now();
        commentMapper.updateStatus(commentId, normalized, now);
        existing.setStatus(normalized);
        existing.setUpdatedAt(now);
        return mapToResponse(existing);
    }

    public void delete(String commentId) {
        CommentEntity existing = commentMapper.findById(commentId);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "评论不存在");
        }
        commentMapper.delete(commentId);
    }

    private PostEntity requirePost(String postId) {
        PostEntity post = postMapper.findById(postId);
        if (post == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "文章不存在");
        }
        return post;
    }

    private void validateUserStatus(UserEntity user) {
        if (user.getStatus() != null && user.getStatus().equalsIgnoreCase("BANNED")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "账号已被禁用，无法评论");
        }
    }

    private String sanitizeContent(String rawContent) {
        if (rawContent == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "评论内容不能为空");
        }
        String content = rawContent.strip();
        if (content.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "评论内容不能为空");
        }
        if (content.length() > MAX_CONTENT_LENGTH) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "评论内容过长");
        }
        return content;
    }

    private void enforceRateLimit(String userId) {
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime last = lastCommentTimes.get(userId);
        if (last != null && Duration.between(last, now).compareTo(COMMENT_COOLDOWN) < 0) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "评论过于频繁，请稍后再试");
        }
    }

    private String normalizeStatus(String status) {
        if (status == null) {
            return STATUS_VISIBLE;
        }
        String upper = status.trim().toUpperCase();
        if (!STATUS_VISIBLE.equals(upper) && !STATUS_HIDDEN.equals(upper)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "不支持的评论状态");
        }
        return upper;
    }

    private CommentResponse mapToResponse(CommentEntity entity) {
        return new CommentResponse(
                entity.getId(),
                entity.getPostId(),
                entity.getAuthorId(),
                entity.getParentId(),
                entity.getContent(),
                entity.getStatus(),
                entity.getCreatedAt() != null ? entity.getCreatedAt().toString() : null,
                entity.getUpdatedAt() != null ? entity.getUpdatedAt().toString() : null
        );
    }
}
