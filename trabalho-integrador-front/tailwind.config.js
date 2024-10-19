/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js, jsx}",
    "./src/views/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans"], // Set default font
        serif: ["Newsreader", "serif"], // Example for a serif font family
      },
      colors: {
        "light-green": "#FAFAF5",
        "default-green": "#426B1F",
      },
    },
  },
  plugins: [],
};
