import { defineStore } from 'pinia'
import { getStorage, setStorage } from '@/utils/storage'
import { setI18nLocale } from '@/i18n'

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    theme: 'light',
    locale: 'zh-CN'
  }),
  actions: {
    initFromStorage() {
      const stored = getStorage('preferences', this.$state)
      this.$patch(stored)
      if (this.locale === 'en') this.locale = 'en-US'
      if (this.locale === 'ja') this.locale = 'ja-JP'
      setStorage('preferences', this.$state)
      document.documentElement.dataset.theme = this.theme
      setI18nLocale(this.locale)
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      setStorage('preferences', this.$state)
      document.documentElement.dataset.theme = this.theme
    },
    switchLocale(locale) {
      this.locale = locale
      setStorage('preferences', this.$state)
      setI18nLocale(locale)
    }
  }
})
