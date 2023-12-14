/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        "rubik-doodle": ["RubikDoodle"],
      },
    },
  },
  plugins: [],
};
