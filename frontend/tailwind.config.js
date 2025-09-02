/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // this includes all your React components
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // change this to match your Figma primary color
      },
      borderRadius: {
        xl: "12px", // matches your button/card style
      },
    },
  },
  plugins: [],
}
