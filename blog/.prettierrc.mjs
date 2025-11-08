/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-astro"],
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
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
        tabWidth: 2,
        printWidth: 100,
        semi: true,
        singleQuote: true
      }
    }
  ]
};
