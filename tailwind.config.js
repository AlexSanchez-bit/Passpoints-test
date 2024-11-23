/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,vue}"],
  theme: {
    extend: {
      colors: {
        // Define la paleta personalizada basada en el diseño
        purple: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        pink: {
          500: "#ec4899",
        },
        red: {
          500: "#f43f5e",
        },
      },
    },
  },
  plugins: [],
};
