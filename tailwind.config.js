module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
        slide: {
          from: { right: "calc(-100vw / 6)" },
          to: { right: "0" },
        },
      },
      animation: {
        slide: "slide 0.4s linear infinite forwards",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
