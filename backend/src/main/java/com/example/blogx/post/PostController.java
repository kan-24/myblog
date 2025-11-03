package com.example.blogx.post;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostResponse create(@Valid @RequestBody CreatePostRequest request) {
        return postService.create(request);
    }

    @GetMapping
    public List<PostResponse> list() {
        return postService.findAll();
    }

    @PutMapping("/{id}")
    public PostResponse update(@PathVariable("id") String id, @Valid @RequestBody UpdatePostRequest request) {
        return postService.update(id, request);
    }

    @PostMapping("/{id}/likes")
    public PostResponse toggleLike(@PathVariable("id") String id, @Valid @RequestBody ToggleLikeRequest request) {
        return postService.toggleLike(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") String id) {
        postService.delete(id);
    }
}
