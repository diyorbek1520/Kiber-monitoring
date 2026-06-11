// ESLint JS qoidalari umumiy JavaScript lint tekshiruvi uchun ishlatiladi.
import js from '@eslint/js';

// React ESLint plagini React komponentlaridagi xatolarni tekshirish uchun ishlatiladi.
import react from 'eslint-plugin-react';

// React Hooks plagini hooklardan to'g'ri foydalanishni tekshirish uchun ishlatiladi.
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        document: 'readonly',
        window: 'readonly',
        localStorage: 'readonly',
        URL: 'readonly',
        import: 'readonly'
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
];
