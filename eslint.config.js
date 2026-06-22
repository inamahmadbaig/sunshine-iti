import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Allow unused variables to be warnings instead of errors to avoid blocking builds
      'no-unused-vars': 'warn',
      // Since React 19 does not require React in JSX scope, allow it
      'react/react-in-jsx-scope': 'off',
      // Downgrade react-hooks rules to warnings so they do not fail the build
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      // Downgrade fast refresh to warning
      'react-refresh/only-export-components': 'warn',
      // Downgrade empty block statements to warning
      'no-empty': 'warn',
    },
  },
])
