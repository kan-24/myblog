export interface User {
  id: string;
  name: string;
  email: string;
  role: 'author' | 'admin' | 'guest';
  bio: string;
  avatar: string;
  headline: string;
  location: string;
  language: 'zh-CN' | 'en';
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover: string;
  category: string;
  tags: string[];
  authorId: string;
  publishedAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  favorites: number;
  featured: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  reactions: string[];
}

export interface Visitor {
  id: string;
  userAgent: string;
  location: string;
  enteredAt: string;
  referrer: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
