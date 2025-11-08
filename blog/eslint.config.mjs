// eslint.config.mjs
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,ts}"],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      project: "./tsconfig.json"
    },
    rules: {
      // aqui você pode adicionar regras específicas
    }
  },
  {
    files: ["**/*.astro"],
    extends: [
      "plugin:astro/recommended"
    ],
    parser: "astro-eslint-parser",
    parserOptions: {
      parser: "@typescript-eslint/parser",
      extraFileExtensions: [".astro"],
      project: "./tsconfig.json"
    },
    rules: {
      // adicione regras específicas para .astro
    }
  },
  {
    files: ["**/*.md"],
    // se desejar lint em markdown frontmatter, adicionar configurações
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    rules: {}
  }
]);
