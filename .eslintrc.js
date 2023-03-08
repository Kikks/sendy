module.exports = {
  root: true,
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  env: {
    node: true,
  },
  extends: ['airbnb-base', 'plugin:vue/recommended', '@vue/prettier'],
  rules: {
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'no-param-reassign': ['error', { props: false }],
    'func-names': 'off',
    'no-confusing-arrow': 'off',
    'no-return-assign': 'off',
    'vue/multi-word-component-names': 'off',
    camelcase: 'off',
  },
};
