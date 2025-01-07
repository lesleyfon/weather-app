import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
		prefix: "tw-",
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {},
			keyframes: {
        'rain-drop': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(10px)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
				"pulse": {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.5" },
				},
      },
      animation: {
        'rain-drop': 'rain-drop 1s infinite',
        'float': 'float 3s ease-in-out infinite',
				"pulse": "pulse 1s infinite",
      }

  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
