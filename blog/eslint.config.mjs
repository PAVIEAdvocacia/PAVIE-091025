// eslint.config.mjs
// @ts-check
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import astroParser from 'astro-eslint-parser';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default defineConfig([
  // Ignora diretórios/arquivos (Flat Config substitui .eslintignore)
  {
    ignores: ['node_modules/**', 'dist/**', 'public/admin/**', 'public/uploads/**']
  },

  // JS/TS — presets oficiais (ESLint + typescript-eslint)
  tseslint.config({
    files: ['**/*.{js,ts}'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    // Se quiser também o "stylistic", descomente:
    // extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...tseslint.configs.stylistic],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { project: './tsconfig.json' } // typed linting (opcional)
    },
    rules: {
      semi: ['error', 'always'],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off'
    }
  }),

  // Astro — registra plugins e aplica preset recomendado
  {
    files: ['**/*.astro'],
    plugins: {
      astro,
      'jsx-a11y': jsxA11y // necessário para astro/jsx-a11y/*
    },
    extends: [...astro.configs.recommended],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.astro'],
        project: './tsconfig.json'
      }
    },
    rules: {
      'astro/no-conflict-set-directives': 'error',
      'astro/jsx-a11y/img-redundant-alt': 'warn'
      // Você pode ativar outras regras de A11Y conforme necessário
    }
  }
]);
