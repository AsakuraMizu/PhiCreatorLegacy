module.exports = {
  root: true,

  env: {
    es2021: true,
    node: true,
    browser: false,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['types/env.d.ts', 'node_modules/**', 'dist/**'],
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
};
