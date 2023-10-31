import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  prefix: "tw-",
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
