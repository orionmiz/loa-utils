module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts}"
  ],
  theme: {
    extend: {
      screens: {
        '~sm': { max: '639px' } // 640 - 1
      },
    },
  },
  plugins: [],
}