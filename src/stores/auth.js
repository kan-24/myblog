import { defineStore } from 'pinia'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'
import { i18n } from '@/i18n'
import { loadInitialUsers } from '@/utils/dataLoader'
import dayjs from 'dayjs'

function buildFakeToken(userId) {
  return {
    accessToken: `demo-${userId}-${crypto.randomUUID()}`,
    refreshToken: `demo-refresh-${userId}-${crypto.randomUUID()}`,
    expiresAt: dayjs().add(7, 'day').valueOf()
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: getStorage('user', null),
    token: getStorage('token', null),
    users: getStorage('users', []),
    loaded: false
  }),
  actions: {
    async ensureLoaded() {
      if (this.loaded) return
      if (!this.users.length) {
        this.users = await loadInitialUsers()
        setStorage('users', this.users)
      }
      this.loaded = true
    },
    async login(email) {
      await this.ensureLoaded()
      const existing = this.users.find((candidate) => candidate.email === email)
      if (!existing) throw new Error(i18n.global.t('auth.userNotFound'))
      this.user = existing
      this.token = buildFakeToken(existing.id)
      setStorage('user', existing)
      setStorage('token', this.token)
    },
    async register(payload) {
      await this.ensureLoaded()
      const exists = this.users.some((candidate) => candidate.email === payload.email)
      if (exists) throw new Error(i18n.global.t('auth.emailExists'))
      const newUser = {
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
      }
      this.users.push(newUser)
      setStorage('users', this.users)
      await this.login(payload.email)
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
