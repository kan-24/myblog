CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    summary TEXT,
    content TEXT,
    cover VARCHAR(512),
    category VARCHAR(128),
    tags_csv VARCHAR(1024),
    author_id VARCHAR(64),
    published_at VARCHAR(64),
    updated_at VARCHAR(64),
    views INT,
    likes INT,
    favorites INT,
    featured BOOLEAN
);;

CREATE TABLE IF NOT EXISTS users (
    id              VARCHAR(64)  PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    avatar_url      VARCHAR(512),
    status          VARCHAR(20)  DEFAULT 'ACTIVE',
    last_login_at   TIMESTAMP,
    created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);;

CREATE TABLE IF NOT EXISTS roles (
    id          VARCHAR(64)  PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL UNIQUE,
    description VARCHAR(255)
);;

CREATE TABLE IF NOT EXISTS user_roles (
    user_id VARCHAR(64) NOT NULL,
    role_id VARCHAR(64) NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);;

CREATE TABLE IF NOT EXISTS permissions (
    id          VARCHAR(64)  PRIMARY KEY,
    code        VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
);;

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id       VARCHAR(64) NOT NULL,
    permission_id VARCHAR(64) NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);;

CREATE TABLE IF NOT EXISTS user_tokens (
    id            VARCHAR(64) PRIMARY KEY,
    user_id       VARCHAR(64) NOT NULL,
    refresh_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at    TIMESTAMP   NOT NULL,
    created_at    TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;;

CREATE OR REPLACE TRIGGER trigger_update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();;

-- 评论表，支持楼中楼
CREATE TABLE IF NOT EXISTS comments (
    id          VARCHAR(64) PRIMARY KEY,
    post_id     VARCHAR(64) NOT NULL,
    author_id   VARCHAR(64) NOT NULL,
    parent_id   VARCHAR(64),                -- NULL 表示顶级评论
    content     TEXT        NOT NULL,
    status      VARCHAR(20) NOT NULL DEFAULT 'VISIBLE',  -- 审核状态：VISIBLE / HIDDEN / PENDING
    created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comments_post  FOREIGN KEY (post_id)  REFERENCES posts(id)  ON DELETE CASCADE,
    CONSTRAINT fk_comments_user  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_parent FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind = 'i'
          AND c.relname = 'idx_comments_post_created_at'
    ) THEN
        EXECUTE 'CREATE INDEX idx_comments_post_created_at ON comments (post_id, created_at DESC)';
    END IF;
END;
$$;

-- 点赞 / 反应表，这里仅存“点赞”类型，若需要可扩展 reaction_type
CREATE TABLE IF NOT EXISTS post_likes (
    post_id    VARCHAR(64) NOT NULL,
    user_id    VARCHAR(64) NOT NULL,
    created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (post_id, user_id),
    CONSTRAINT fk_post_likes_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_post_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 如需收藏或其他反应，可在 post_likes 中新增 reaction_type ENUM/VARCHAR，并把主键改成 (post_id, user_id, reaction_type)
