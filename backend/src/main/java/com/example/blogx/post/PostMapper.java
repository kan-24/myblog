package com.example.blogx.post;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PostMapper {
    void insert(@Param("post") PostEntity post);
    List<PostEntity> findAll();
    void update(@Param("post") PostEntity post);
    PostEntity findById(@Param("id") String id);
    void updateLikes(@Param("id") String id, @Param("likes") Integer likes);
    void delete(@Param("id") String id);
}
