/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#6d4c3d",
        paper: "#ede0d4",
        mist: "#e6ccb2",
        cedar: "#7f5539",
        rust: "#9c6644",
        night: "#b08968"
      },
      boxShadow: {
        soft: "0 24px 70px rgba(127, 85, 57, 0.18)"
      }
    }
  },
  plugins: []
};
