/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
        serif: ["Antic Didone", "Georgia", "serif"],
        jp: ["Noto Sans JP", "sans-serif"],
      },
    },
  },
  plugins: [],
};
