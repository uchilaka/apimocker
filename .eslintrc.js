module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ["@typescript-eslint"],
  extends: [
    'airbnb-base',
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  env: {
    node: true,
    mocha: true,
  },
  rules: {
    'comma-dangle': ['error', 'never'],
    'quotes': ['warning', 'single']
  },
};