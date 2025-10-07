import { defineStore } from 'pinia'
import { getStorage, setStorage } from '@/utils/storage'

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    theme: 'light',
    locale: 'zh-CN'
  }),
  actions: {
    initFromStorage() {
      const stored = getStorage('preferences', this.$state)
      this.$patch(stored)
      document.documentElement.dataset.theme = this.theme
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      setStorage('preferences', this.$state)
      document.documentElement.dataset.theme = this.theme
    },
    switchLocale(locale) {
      this.locale = locale
      setStorage('preferences', this.$state)
    }
  }
})
