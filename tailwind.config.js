/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "light-secondary": "#F2F2F7",
      }
    },
  },
  // plugins: [require("daisyui")],
};
