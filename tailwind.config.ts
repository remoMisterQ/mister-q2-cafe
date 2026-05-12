import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#fbf4e8",
        latte: "#ead6bd",
        mocha: "#8a5f3d",
        espresso: "#21160f"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(33, 22, 15, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
