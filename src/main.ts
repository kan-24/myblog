import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@unhead/vue/client';
import App from './App.vue';
import router from './router';
import lazy from './directives/lazy';
import { usePreferencesStore } from './stores/preferences';
import { useAuthStore } from './stores/auth';
import Particles from '@tsparticles/vue3';
import { loadFull } from 'tsparticles';
import './assets/tailwind.css';

// BlogX demo front-end only. 仅演示用途，不用于生产。
const app = createApp(App);
const pinia = createPinia();
const head = createHead();

app.use(pinia);
app.use(router);
app.use(head);
app.directive('lazy', lazy);
app.use(Particles, {
  init: async (engine) => {
    await loadFull(engine);
  }
});

const preferences = usePreferencesStore();
preferences.initFromStorage();

router.beforeEach(async (to) => {
  if (!to.meta?.requiresAdmin) return true;
  const authStore = useAuthStore();
  await authStore.ensureLoaded?.();
  if (authStore.user?.role === 'admin') return true;
  window.alert('仅管理员可访问该功能');
  return { name: 'home' };
});

app.mount('#app');
