import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
        action: colors.green,
      },
    },
  },
  plugins: [],
} satisfies Config;
