<template>
  <section class="mx-auto max-w-3xl space-y-6">
    <header class="space-y-3">
      <h1 class="text-2xl font-bold">{{ t('user.title') }}</h1>
      <p class="text-sm text-slate-500">{{ t('user.description') }}</p>
    </header>

    <div v-if="!auth.user" class="grid gap-6 md:grid-cols-2">
      <form
        class="space-y-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        @submit.prevent="onLogin"
      >
        <h2 class="text-lg font-semibold">{{ t('user.login') }}</h2>
        <input
          v-model="loginEmail"
          type="email"
          required
          :placeholder="t('user.placeholders.email')"
          class="w-full rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
        />
        <button class="w-full rounded bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          {{ t('user.buttons.login') }}
        </button>
      </form>
      <form
        class="space-y-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        @submit.prevent="onRegister"
      >
        <h2 class="text-lg font-semibold">{{ t('user.register') }}</h2>
        <input
          v-model="registerName"
          type="text"
          required
          :placeholder="t('user.placeholders.name')"
          class="w-full rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
        />
        <input
          v-model="registerEmail"
          type="email"
          required
          :placeholder="t('user.placeholders.email')"
          class="w-full rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
        />
        <button class="w-full rounded bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          {{ t('user.buttons.register') }}
        </button>
      </form>
    </div>

    <div v-else class="space-y-6">
      <div class="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <header class="flex items-center gap-4">
          <img :src="auth.user.avatar || placeholder" alt="" class="h-16 w-16 rounded-full object-cover" />
          <div>
            <h2 class="text-xl font-semibold">{{ auth.user.name }}</h2>
            <p class="text-sm text-slate-500">{{ auth.user.headline || t('user.placeholders.intro') }}</p>
          </div>
        </header>
        <button class="mt-4 rounded border border-slate-200 px-3 py-2 text-sm hover:border-brand dark:border-slate-700" @click="auth.logout">
          {{ t('user.logout') }}
        </button>
      </div>

      <form
        class="space-y-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        @submit.prevent="onProfileUpdate"
      >
        <h3 class="text-lg font-semibold">{{ t('user.profileEdit') }}</h3>
        <div class="grid gap-4 md:grid-cols-2">
          <input
            v-model="profile.name"
            type="text"
            :placeholder="t('user.placeholders.name')"
            class="rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
          <input
            v-model="profile.headline"
            type="text"
            :placeholder="t('user.placeholders.headline')"
            class="rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
          <input
            v-model="profile.location"
            type="text"
            :placeholder="t('user.placeholders.location')"
            class="rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
          <select
            v-model="profile.language"
            class="rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="zh-CN">{{ t('language.zh') }}</option>
            <option value="en-US">{{ t('language.en') }}</option>
            <option value="ja-JP">{{ t('language.ja') }}</option>
          </select>
        </div>
        <textarea
          v-model="profile.bio"
          rows="4"
          :placeholder="t('user.placeholders.bio')"
          class="w-full rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
        />
        <label class="flex flex-col gap-2 text-sm">
          {{ t('user.placeholders.avatar') }}
          <input type="file" accept="image/*" @change="onAvatarChange" />
        </label>
        <button class="rounded bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          {{ t('user.buttons.updateProfile') }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const auth = useAuthStore()
const { t } = useI18n()

const loginEmail = ref('')
const registerEmail = ref('')
const registerName = ref('')
const placeholder = 'https://avatars.githubusercontent.com/u/000?v=4'

const profile = reactive({
  name: '',
  bio: '',
  headline: '',
  location: '',
  language: 'zh-CN',
  avatar: ''
})

watch(
  () => auth.user,
  (user) => {
    if (user) {
      Object.assign(profile, user)
      if (profile.language === 'en') profile.language = 'en-US'
      if (profile.language === 'ja') profile.language = 'ja-JP'
    }
  },
  { immediate: true }
)

const onLogin = async () => {
  try {
    await auth.login(loginEmail.value)
  } catch (error) {
    window.alert(error?.message ?? t('user.alerts.loginError'))
  }
}

const onRegister = async () => {
  try {
    await auth.register({ email: registerEmail.value, name: registerName.value })
  } catch (error) {
    window.alert(error?.message ?? t('user.alerts.registerError'))
  }
}

const onProfileUpdate = () => {
  auth.updateProfile(profile)
  window.alert(t('user.alerts.profileUpdated'))
}

const onAvatarChange = async (event) => {
  const target = event.target
  const file = target?.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    profile.avatar = /** @type {string} */ (reader.result)
  }
  reader.readAsDataURL(file)
}
</script>
