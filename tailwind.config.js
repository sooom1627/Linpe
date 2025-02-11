/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/*.{js,jsx,ts,tsx}",
    "./feature/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    fontFamily: {
      sans: ["Montserrat_400Regular"],
      medium: ["Montserrat_500Medium"],
      semibold: ["Montserrat_600SemiBold"],
      bold: ["Montserrat_700Bold"],
    },
    extend: {
      colors: {
        // アクセントカラー
        accent: {
          DEFAULT: "#FA4714",
          50: "#FEE3DC",
          100: "#FED3C7",
          200: "#FDB29D",
          300: "#FC9174",
          400: "#FB714A",
          500: "#FA4714",
          600: "#D13507",
          700: "#9B2705",
          800: "#651A03",
          900: "#2F0C02",
        },
        // テキストカラー
        text: {
          DEFAULT: "#18181B", // zinc-900と同じ
          light: "#71717A", // zinc-500
          lighter: "#A1A1AA", // zinc-400
          dark: "#09090B", // zinc-950
          white: "#FFFFFF",
        },
        // 背景色
        background: {
          DEFAULT: "#FFFFFF",
          alt: "#F4F4F5", // zinc-100
          dark: "#18181B", // zinc-900
        },
        // ステータスカラー
        status: {
          success: "#22C55E", // green-500
          error: "#EF4444", // red-500
          warning: "#F59E0B", // amber-500
          info: "#3B82F6", // blue-500
        },
      },
    },
  },
  plugins: [],
};
