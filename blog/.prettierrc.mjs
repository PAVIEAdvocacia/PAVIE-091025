// .prettierrc.mjs
/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: ["**/*.astro"],
      options: {
        parser: "astro"
      }
    },
    {
      files: ["**/*.{js,ts,md,css}"],
      options: {
        // você pode definir regras gerais aqui: printWidth, tabWidth, etc
        printWidth: 100,
        tabWidth: 2,
        semi: true,
        singleQuote: true
      }
    }
  ]
};
