import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#121212",
        accent: "#3C4741",
        "muted-gray": "#9A9C9B",
      },
    },
  },
  darkMode: "class",
}

export default config

