import { defineStore } from 'pinia';
import { getStorage, setStorage } from '@/utils/storage';

interface PreferencesState {
  theme: 'light' | 'dark';
  locale: 'zh-CN' | 'en';
}

export const usePreferencesStore = defineStore('preferences', {
  state: (): PreferencesState => ({
    theme: 'light',
    locale: 'zh-CN'
  }),
  actions: {
    initFromStorage() {
      const stored = getStorage<PreferencesState>('preferences', this.$state);
      this.$patch(stored);
      document.documentElement.dataset.theme = this.theme;
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      setStorage('preferences', this.$state);
      document.documentElement.dataset.theme = this.theme;
    },
    switchLocale(locale: PreferencesState['locale']) {
      this.locale = locale;
      setStorage('preferences', this.$state);
    }
  }
});
