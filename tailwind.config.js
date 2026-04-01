/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1a3c6e",
        accent: "#e85d2f",
        accent2: "#f5a623",
        light: "#f7f4ef",
        textc: "#1c1c2e",
        muted: "#6b7280",
        borderc: "#e5e0d8"
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["DM Sans", "sans-serif"]
      },
      boxShadow: {
        soft: "0 4px 28px rgba(26,60,110,0.09)",
        strong: "0 12px 48px rgba(26,60,110,0.16)"
      }
    }
  },
  plugins: []
};
