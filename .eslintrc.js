module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['plugin:vue/essential', 'standard'],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'no-unused-vars': 'off',
    'vue/no-unused-components': 'warn',
    'vue/no-multiple-template-root': 'off',
    'vue/no-v-model-argument': 'off',
    'vue/no-v-for-template-key': 'off',
    'space-before-function-paren': ['error', 'never']
  }
}
