/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b0b",
        paper: "#f4f0e8",
        mist: "#ddd6c9",
        cedar: "#2f3f35",
        rust: "#8f3f2d",
        night: "#111111"
      },
      boxShadow: {
        soft: "0 24px 70px rgba(11, 11, 11, 0.16)"
      }
    }
  },
  plugins: []
};
