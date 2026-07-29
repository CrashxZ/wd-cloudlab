import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: { extend: { colors: {
    ink: "#171717",
    cloud: "#f5f5f4",
    signal: "#0067b1",
    red: { 50:"#eff8ff",100:"#dbeeff",200:"#b9dcff",300:"#85c2ff",400:"#3c9ee8",500:"#0073c6",600:"#0067b1",700:"#07578f",800:"#0b4975",900:"#0d3d60",950:"#072840" }
  } } },
  plugins: []
} satisfies Config;
