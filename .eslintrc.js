module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    commonjs: true,
    amd: true,
    es6: true,
    mocha: true,
  },
  extends: [
    'plugin:prettier/recommended',
    'plugin:vue/vue3-essential',
    'eslint:recommended',
  ],

  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    'no-unused-vars': 'off',
    // 单引号警告
    quotes: ['warn', 'single'],
    // 	要求 switch 语句中有 default 分支
    'default-case': 'error',
    // 要求使用 ===
    eqeqeq: 'warn',
    'prettier/prettier': 'warn',
  },
};
