<template>
  <section class="mx-auto max-w-3xl space-y-6">
    <header class="space-y-3">
      <h1 class="text-2xl font-bold">个人中心</h1>
      <p class="text-sm text-slate-500">管理登录、注册与资料信息。</p>
    </header>

    <div v-if="!auth.user" class="grid gap-6 md:grid-cols-2">
      <form
        class="space-y-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        @submit.prevent="onLogin"
      >
        <h2 class="text-lg font-semibold">登录</h2>
        <input
          v-model="loginEmail"
          type="email"
          required
          placeholder="邮箱"
          class="w-full rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
        />
        <button class="w-full rounded bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          登录
        </button>
      </form>
      <form
        class="space-y-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        @submit.prevent="onRegister"
      >
        <h2 class="text-lg font-semibold">注册</h2>
        <input
          v-model="registerName"
          type="text"
          required
          placeholder="姓名"
          class="w-full rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
        />
        <input
          v-model="registerEmail"
          type="email"
          required
          placeholder="邮箱"
          class="w-full rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
        />
        <button class="w-full rounded bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          注册
        </button>
      </form>
    </div>

    <div v-else class="space-y-6">
      <div class="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <header class="flex items-center gap-4">
          <img :src="auth.user.avatar || placeholder" alt="" class="h-16 w-16 rounded-full object-cover" />
          <div>
            <h2 class="text-xl font-semibold">{{ auth.user.name }}</h2>
            <p class="text-sm text-slate-500">{{ auth.user.headline || '添加一句话介绍自己' }}</p>
          </div>
        </header>
        <button class="mt-4 rounded border border-slate-200 px-3 py-2 text-sm hover:border-brand dark:border-slate-700" @click="auth.logout">
          退出登录
        </button>
      </div>

      <form
        class="space-y-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        @submit.prevent="onProfileUpdate"
      >
        <h3 class="text-lg font-semibold">资料编辑</h3>
        <div class="grid gap-4 md:grid-cols-2">
          <input
            v-model="profile.name"
            type="text"
            placeholder="姓名"
            class="rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
          <input
            v-model="profile.headline"
            type="text"
            placeholder="职位头衔"
            class="rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
          <input
            v-model="profile.location"
            type="text"
            placeholder="所在地"
            class="rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
          <select
            v-model="profile.language"
            class="rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="zh-CN">中文</option>
            <option value="en">English</option>
          </select>
        </div>
        <textarea
          v-model="profile.bio"
          rows="4"
          placeholder="个人简介"
          class="w-full rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
        />
        <label class="flex flex-col gap-2 text-sm">
          头像上传（base64）
          <input type="file" accept="image/*" @change="onAvatarChange" />
        </label>
        <button class="rounded bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          更新资料
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

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
    if (user) Object.assign(profile, user)
  },
  { immediate: true }
)

const onLogin = async () => {
  try {
    await auth.login(loginEmail.value)
  } catch (error) {
    window.alert(error?.message ?? '登录失败')
  }
}

const onRegister = async () => {
  try {
    await auth.register({ email: registerEmail.value, name: registerName.value })
  } catch (error) {
    window.alert(error?.message ?? '注册失败')
  }
}

const onProfileUpdate = () => {
  auth.updateProfile(profile)
  window.alert('资料已更新（LocalStorage）')
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
