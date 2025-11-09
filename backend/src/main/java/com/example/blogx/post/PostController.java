package com.example.blogx.post;

import com.example.blogx.user.AuthService;
import com.example.blogx.user.UserEntity;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final AuthService authService;

    public PostController(PostService postService, AuthService authService) {
        this.postService = postService;
        this.authService = authService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostResponse create(
            @RequestHeader("Authorization") String authorization,
            @Valid @RequestBody CreatePostRequest request
    ) {
        UserEntity user = authService.requireRole(authorization, "admin");
        request.setAuthorId(user.getId());
        return postService.create(request);
    }

    @GetMapping
    public List<PostResponse> list(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "20") int size
    ) {
        return postService.findAll(page, size);
    }

    @GetMapping("/{id}")
    public PostResponse detail(@PathVariable String id) {
        return postService.findById(id);
    }

    @PutMapping("/{id}")
    public PostResponse update(
            @RequestHeader("Authorization") String authorization,
            @PathVariable("id") String id,
            @Valid @RequestBody UpdatePostRequest request
    ) {
        authService.requireRole(authorization, "admin");
        return postService.update(id, request);
    }

    @PostMapping("/{id}/likes")
    public PostResponse like(
            @RequestHeader("Authorization") String authorization,
            @PathVariable("id") String id
    ) {
        UserEntity user = authService.requireAuthenticated(authorization);
        return postService.like(id, user.getId());
    }

    @DeleteMapping("/{id}/likes")
    public PostResponse unlike(
            @RequestHeader("Authorization") String authorization,
            @PathVariable("id") String id
    ) {
        UserEntity user = authService.requireAuthenticated(authorization);
        return postService.unlike(id, user.getId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@RequestHeader("Authorization") String authorization, @PathVariable("id") String id) {
        authService.requireRole(authorization, "admin");
        postService.delete(id);
    }
}
