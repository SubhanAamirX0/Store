/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#253237",
        paper: "#e0fbfc",
        mist: "#c2dfe3",
        cedar: "#5c6b73",
        rust: "#9db4c0",
        night: "#253237"
      },
      boxShadow: {
        soft: "0 24px 70px rgba(37, 50, 55, 0.16)"
      }
    }
  },
  plugins: []
};
