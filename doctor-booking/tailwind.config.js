/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        teal: {
          50: "#E1F5EE",
          100: "#9FE1CB",
          400: "#1D9E75",
          600: "#0F6E56",
          800: "#085041",
          900: "#04342C",
        },
        coral: {
          50: "#FAECE7",
          100: "#F5C4B3",
          400: "#F0997B",
          600: "#D85A30",
          800: "#712B13",
          900: "#4A1B0C",
        },
        plum: {
          50: "#EEEDFE",
          100: "#CECBF6",
          400: "#7F77DD",
          600: "#534AB7",
          800: "#3C3489",
          900: "#26215C",
        },
        amber: {
          100: "#FAC775",
          800: "#412402",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
