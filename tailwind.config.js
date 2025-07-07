/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F5EEDC",
        blue: "#27548A",
        darkTeal: "#183B4E",
        mustard: "#DAA853",
        background: "#F9FAFB",
        customBg: "oklch(86.9% 0.022 252.894)",
      },
    },
  },
  plugins: [require("daisyui")],
};
