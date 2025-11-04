import { defineStore } from 'pinia'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'
import { i18n } from '@/i18n'
import { fetchUsers, registerUser } from '@/services/api/users'
import dayjs from 'dayjs'

function buildFakeToken(userId) {
  return {
    accessToken: `demo-${userId}-${crypto.randomUUID()}`,
    refreshToken: `demo-refresh-${userId}-${crypto.randomUUID()}`,
    expiresAt: dayjs().add(7, 'day').valueOf()
  }
}

function normalizeUser(raw) {
  if (!raw) return null
  return {
    avatar: raw.avatar ?? raw.avatarUrl ?? '',
    avatarUrl: raw.avatarUrl ?? raw.avatar ?? '',
    bio: raw.bio ?? '',
    headline: raw.headline ?? '',
    language: raw.language ?? 'zh-CN',
    location: raw.location ?? '',
    status: raw.status ?? 'ACTIVE',
    ...raw
  }
}

const storedUsers = getStorage('users', [])
const initialUsers = Array.isArray(storedUsers) ? storedUsers.map(normalizeUser) : []
const initialUser = normalizeUser(getStorage('user', null))

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: initialUser,
    token: getStorage('token', null),
    users: initialUsers,
    loaded: false
  }),
  actions: {
    async ensureLoaded() {
      if (this.loaded) return
      try {
        const users = await fetchUsers()
        this.users = Array.isArray(users) ? users.map(normalizeUser) : []
        setStorage('users', this.users)
      } catch (error) {
        const fallback = getStorage('users', [])
        this.users = Array.isArray(fallback) ? fallback.map(normalizeUser) : []
        console.error('Failed to load users from API', error)
      }
      this.loaded = true
    },
    async login(email) {
      await this.ensureLoaded()
      const existing = this.users.find((candidate) => candidate.email === email)
      if (!existing) throw new Error(i18n.global.t('auth.userNotFound'))
      this.user = normalizeUser(existing)
      this.token = buildFakeToken(existing.id)
      setStorage('user', this.user)
      setStorage('token', this.token)
    },
    async register(payload) {
      await this.ensureLoaded()
      const created = await registerUser({
        email: payload.email,
        name: payload.name,
        password: payload.password
      })
      const normalized = normalizeUser(created)
      this.users.push(normalized)
      setStorage('users', this.users)
      this.user = normalized
      this.token = buildFakeToken(normalized.id)
      setStorage('user', normalized)
      setStorage('token', this.token)
    },
    updateProfile(data) {
      if (!this.user) return
      this.user = { ...this.user, ...data, updatedAt: new Date().toISOString() }
      this.users = this.users.map((item) => (item.id === this.user?.id ? this.user : item))
      setStorage('user', this.user)
      setStorage('users', this.users)
    },
    logout() {
      this.user = null
      this.token = null
      removeStorage('user')
      removeStorage('token')
    }
  }
})
