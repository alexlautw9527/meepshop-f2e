module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/jsx-runtime',
    'prettier',
  ],

  // https://stackoverflow.com/questions/73915236/how-do-i-configure-eslint-to-ignore-my-root-folder-and-to-only-include-my-src-fo
  ignorePatterns: ['/*', '!/src'], // 只檢查 src

  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.app.json',
  },

  // react-refresh 是 vite 預設配置
  plugins: ['react-refresh', 'prettier'],
  rules: {
    // vite 預設配置
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    // functional component 使用函數預設參數作為 defaultProps, 不另外定義 defaultProps
    'react/require-default-props': [
      'error',
      {
        functions: 'defaultArguments',
      },
    ],
    'import/prefer-default-export': 'off',
    'prettier/prettier': [
      'error',
      {},
      {
        usePrettierrc: true,
      },
    ],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
    'jsx-a11y/label-has-for': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],

    'import/no-extraneous-dependencies': [
      'error',
      {
        // 可以引入 devDependencies 的檔案
        devDependencies: [
          '**/mocks/**',
          '**/tests/**',
          '**/.storybook/**',
          '**/*{.,_}{test,spec}.{ts,tsx}',
          '**/vitest.config.ts',
          '**/*.stories.tsx',
        ],
      },
    ],

    // 用於 barrel file, 例如 index.ts
    'no-restricted-exports': [
      'error',
      { restrictDefaultExports: { defaultFrom: false } },
    ],

    "react/function-component-definition": "off",

    // underscore 的變數(_) 不會被檢查
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: 'tsconfig.app.json',
      },
    },
  },
  overrides: [
    {
      files: ['*.tsx'],
      rules: {
        // ts 已強制定義 props 的型別, prop spreading 是安全的
        'react/jsx-props-no-spreading': 'off',
      },
    },
  ],
};
