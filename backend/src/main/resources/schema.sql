CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    summary TEXT,
    content CLOB,
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
);
