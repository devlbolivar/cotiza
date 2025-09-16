import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans]
      },
      colors: {
        primary: {
          DEFAULT: "#1d4ed8",
          foreground: "#f8fafc"
        }
      },
      boxShadow: {
        card: "0 4px 24px -12px rgba(15, 23, 42, 0.3)"
      }
    }
  },
  plugins: []
};

export default config;
