const OFF = 'off';
const ERROR = 'error';
const WARN = 'warn';

module.exports = {
  root: true,

  plugins: ['react', 'react-hooks', 'react', 'jest-dom', 'testing-library', 'react-hooks', 'prettier'],

  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },

  env: {
    jest: true,
  },

  rules: {
    'arrow-parens': OFF,
    'prettier/prettier': ERROR,
    'no-use-before-define': OFF,
    'react/jsx-filename-extension': OFF,
    'react/prop-types': OFF,
    'import/prefer-default-export': OFF,
    'react/react-in-jsx-scope': OFF,
    'react-hooks/exhaustive-deps': WARN,
    'react/jsx-props-no-spreading': OFF,
    'jsx-a11y/label-has-associated-control': OFF,
  },
  globals: {
    fetch: true,
  },
};
