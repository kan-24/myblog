package com.example.blogx.post;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PostMapper {
    void insert(@Param("post") PostEntity post);
    List<PostEntity> findAll(@Param("limit") int limit, @Param("offset") int offset);
    PostEntity findById(@Param("id") String id);
    void update(@Param("post") PostEntity post);
    void updateLikes(@Param("id") String id, @Param("likes") Integer likes);
    void adjustLikes(@Param("id") String id, @Param("delta") int delta);
    void delete(@Param("id") String id);
}
