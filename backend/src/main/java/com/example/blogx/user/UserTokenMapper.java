package com.example.blogx.user;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserTokenMapper {

    void insert(@Param("token") UserTokenEntity token);

    UserTokenEntity findByRefreshToken(@Param("refreshToken") String refreshToken);

    void deleteByRefreshToken(@Param("refreshToken") String refreshToken);
}
