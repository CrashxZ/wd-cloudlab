import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: { extend: { colors: { ink: "#171717", cloud: "#f5f5f4", signal: "#e21b2d" } } },
  plugins: []
} satisfies Config;
