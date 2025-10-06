import { defineStore } from 'pinia';
import type { AuthTokens, User } from '@/types/blog';
import { getStorage, setStorage, removeStorage } from '@/utils/storage';
import { loadInitialUsers } from '@/utils/dataLoader';
import dayjs from 'dayjs';

interface AuthState {
  user: User | null;
  token: AuthTokens | null;
  users: User[];
  loaded: boolean;
}

function buildFakeToken(userId: string): AuthTokens {
  return {
    accessToken: `demo-${userId}-${crypto.randomUUID()}`,
    refreshToken: `demo-refresh-${userId}-${crypto.randomUUID()}`,
    expiresAt: dayjs().add(7, 'day').valueOf()
  };
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: getStorage<User | null>('user', null),
    token: getStorage<AuthTokens | null>('token', null),
    users: getStorage<User[]>('users', []),
    loaded: false
  }),
  actions: {
    async ensureLoaded() {
      if (this.loaded) return;
      if (!this.users.length) {
        this.users = await loadInitialUsers();
        setStorage('users', this.users);
      }
      this.loaded = true;
    },
    async login(email: string) {
      await this.ensureLoaded();
      const existing = this.users.find((candidate) => candidate.email === email);
      if (!existing) throw new Error('用户不存在');
      this.user = existing;
      this.token = buildFakeToken(existing.id);
      setStorage('user', existing);
      setStorage('token', this.token);
    },
    async register(payload: Pick<User, 'name' | 'email'>) {
      await this.ensureLoaded();
      const exists = this.users.some((candidate) => candidate.email === payload.email);
      if (exists) throw new Error('邮箱已注册');
      const newUser: User = {
        id: crypto.randomUUID(),
        name: payload.name,
        email: payload.email,
        role: 'author',
        bio: '',
        avatar: '',
        headline: '',
        location: '',
        language: 'zh-CN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.users.push(newUser);
      setStorage('users', this.users);
      await this.login(payload.email);
    },
    updateProfile(data: Partial<User>) {
      if (!this.user) return;
      this.user = { ...this.user, ...data, updatedAt: new Date().toISOString() };
      this.users = this.users.map((item) => (item.id === this.user?.id ? this.user! : item));
      setStorage('user', this.user);
      setStorage('users', this.users);
    },
    logout() {
      this.user = null;
      this.token = null;
      removeStorage('user');
      removeStorage('token');
    }
  }
});
