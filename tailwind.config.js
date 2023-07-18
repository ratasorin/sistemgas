module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    extend: {
      keyframes: {
        slide: {
          from: { right: "calc(-100vw / 4)" },
          to: { right: "0" },
        },
      },
      animation: {
        slide: "slide 1s linear infinite forwards",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
