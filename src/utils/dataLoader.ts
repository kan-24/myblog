import type { Comment, Post, User, Visitor } from '@/types/blog';

async function loadJSON<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return (await response.json()) as T;
}

export async function loadInitialUsers() {
  return loadJSON<User[]>('/data/users.json');
}

export async function loadInitialPosts() {
  return loadJSON<Post[]>('/data/posts.json');
}

export async function loadInitialComments() {
  return loadJSON<Comment[]>('/data/comments.json');
}

export async function loadInitialVisitors() {
  return loadJSON<Visitor[]>('/data/visitors.json');
}
