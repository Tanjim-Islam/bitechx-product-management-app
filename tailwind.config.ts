import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rich_black: { DEFAULT: "#0d1821", 100: "#030507", 200: "#050a0d", 300: "#080e14", 400: "#0a131a", 500: "#0d1821", 600: "#284863", 700: "#4279a6", 800: "#7aa6ca", 900: "#bdd3e5" },
        anti_flash_white: { DEFAULT: "#eff1f3", 100: "#2a3037", 200: "#53616e", 300: "#8291a1", 400: "#b9c2ca", 500: "#eff1f3", 600: "#f3f5f6", 700: "#f6f7f8", 800: "#f9fafb", 900: "#fcfcfd" },
        hookers_green: { DEFAULT: "#4e6e5d", 100: "#101613", 200: "#1f2c25", 300: "#2f4238", 400: "#3f584b", 500: "#4e6e5d", 600: "#69947d", 700: "#8eaf9e", 800: "#b4cabe", 900: "#d9e4df" },
        lion: { DEFAULT: "#ad8a64", 100: "#241c13", 200: "#483826", 300: "#6c5339", 400: "#906f4c", 500: "#ad8a64", 600: "#bea284", 700: "#ceb9a3", 800: "#dfd1c2", 900: "#efe8e0" },
        chestnut: { DEFAULT: "#a44a3f", 100: "#210f0d", 200: "#421e1a", 300: "#632e27", 400: "#843d33", 500: "#a44a3f", 600: "#c0695d", 700: "#d08e86", 800: "#e0b4ae", 900: "#efd9d7" }
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" }
    }
  },
  plugins: []
};
export default config;

