/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app.jsx" // Important since your app.jsx is in the root!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
