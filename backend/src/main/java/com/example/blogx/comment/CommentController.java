package com.example.blogx.comment;

import com.example.blogx.user.AuthService;
import com.example.blogx.user.UserEntity;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
public class CommentController {

    private final CommentService commentService;
    private final AuthService authService;

    public CommentController(CommentService commentService, AuthService authService) {
        this.commentService = commentService;
        this.authService = authService;
    }

    @PostMapping
    public CommentResponse create(
            @RequestHeader("Authorization") String authorization,
            @PathVariable("postId") String postId,
            @Valid @RequestBody CreateCommentRequest request
    ) {
        UserEntity user = authService.requireAuthenticated(authorization);
        return commentService.create(postId, request, user);
    }

    @GetMapping
    public List<CommentResponse> list(
            @PathVariable("postId") String postId,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "20") int size
    ) {
        return commentService.list(postId, page, size);
    }

    @PutMapping("/{commentId}")
    public CommentResponse updateStatus(
            @RequestHeader("Authorization") String authorization,
            @PathVariable("postId") String postId,
            @PathVariable("commentId") String commentId,
            @Valid @RequestBody UpdateCommentStatusRequest request
    ) {
        authService.requireRole(authorization, "admin");
        return commentService.updateStatus(commentId, request.getStatus());
    }

    @DeleteMapping("/{commentId}")
    public void delete(
            @RequestHeader("Authorization") String authorization,
            @PathVariable("postId") String postId,
            @PathVariable("commentId") String commentId
    ) {
        authService.requireRole(authorization, "admin");
        commentService.delete(commentId);
    }
}
