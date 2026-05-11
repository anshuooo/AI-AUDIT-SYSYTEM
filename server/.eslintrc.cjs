module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2024: true,
    jest: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'comma-dangle': ['error', 'always-multiline'],
  },
};
