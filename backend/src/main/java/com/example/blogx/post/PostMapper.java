package com.example.blogx.post;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PostMapper {
    void insert(@Param("post") PostEntity post);
}
