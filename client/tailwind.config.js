/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors")

module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    colors: {
      activeTabDark: "#2F4156",
      activeTabLight: "#D3E4FF",
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      emerald: colors.emerald,
      indigo: colors.indigo,
      stone: colors.stone,
      sky: colors.sky,
      neutral: colors.neutral,
      gray: colors.gray,
      slate: colors.slate,
      blue: colors.blue,
      green: colors.green,
      purple: colors.purple,
      yellow: colors.yellow,
      red: colors.red,
      customBlue1: "#1B72C0",
      customBlue2: "#A2C9FF",
      customMessage1: "#A2C9FF",
      customMessage2: "#1E2A32",
    },
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
}