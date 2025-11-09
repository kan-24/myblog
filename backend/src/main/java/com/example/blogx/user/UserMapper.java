package com.example.blogx.user;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {

    List<UserEntity> findAll();

    UserEntity findByEmail(@Param("email") String email);
    UserEntity findById(@Param("id") String id);

    void insert(@Param("user") UserEntity user);

    String findRoleIdByName(@Param("name") String name);

    void insertRole(@Param("roleId") String roleId, @Param("name") String name, @Param("description") String description);

    void insertUserRole(@Param("userId") String userId, @Param("roleId") String roleId);
}
