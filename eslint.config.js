import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'

export default [
  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      vue: pluginVue
    },
    rules: {
      ...pluginVue.configs['vue3-essential'].rules,
      'vue/multi-word-component-names': 'off'
    }
  },
  prettier
]
