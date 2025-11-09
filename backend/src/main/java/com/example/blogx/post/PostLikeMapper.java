package com.example.blogx.post;

import java.time.OffsetDateTime;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PostLikeMapper {

    boolean exists(@Param("postId") String postId, @Param("userId") String userId);

    void insert(@Param("postId") String postId, @Param("userId") String userId, @Param("createdAt") OffsetDateTime createdAt);

    void delete(@Param("postId") String postId, @Param("userId") String userId);
}
