/** @type {import('tailwindcss').Config} */
const cor = (v) => `rgb(var(--${v}) / <alpha-value>)`;
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["var(--font-baloo)", "ui-rounded", "system-ui", "sans-serif"] },
      colors: {
        fundo: cor("fundo"), tinta: cor("tinta"), folha: cor("folha"), casco: cor("casco"),
        terra: cor("terra"), ceu: cor("ceu"), cartao: cor("cartao"), brasa: cor("brasa"), agua: cor("agua"),
      },
      borderRadius: { blob: "2rem 2.5rem 1.75rem 2.25rem" },
    },
  },
  plugins: [],
};
