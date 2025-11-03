import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.json'
import enUS from './locales/en-US.json'
import jaJP from './locales/ja-JP.json'

export const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ja-JP': jaJP
}

export const DEFAULT_LOCALE = 'zh-CN'

export const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages
})

export function setI18nLocale(locale) {
  i18n.global.locale.value = locale
  document.documentElement.lang = locale
}
