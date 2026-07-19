module.exports = {
  content: ["./src/views/**/*.ejs", "./src/public/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef3ff",
          100: "#dae4ff",
          200: "#bdd0ff",
          300: "#90b1ff",
          400: "#5d87ff",
          500: "#3563e9",
          600: "#2546d0",
          700: "#1e36a9",
          800: "#1e3089",
          900: "#1e2b6f",
        },
        sidebar: {
          bg: "#ffffff",
          hover: "#f5f7fb",
          active: "#eef3ff",
          text: "#2A3547",
          muted: "#7C8FAC",
        },
        surface: {
          DEFAULT: "#F6F9FC",
          card: "#ffffff",
          border: "#EBF1FF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
        "card-hover":
          "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
        nav: "0 1px 3px 0 rgb(0 0 0 / 0.04)",
      },
    },
  },
  plugins: [],
};
