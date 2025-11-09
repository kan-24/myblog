package com.example.blogx.comment;

import java.time.OffsetDateTime;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CommentMapper {

    void insert(@Param("comment") CommentEntity comment);

    List<CommentEntity> findByPost(@Param("postId") String postId,
                                   @Param("limit") int limit,
                                   @Param("offset") int offset);

    CommentEntity findById(@Param("id") String id);

    void updateStatus(@Param("id") String id,
                      @Param("status") String status,
                      @Param("updatedAt") OffsetDateTime updatedAt);

    void delete(@Param("id") String id);
}
