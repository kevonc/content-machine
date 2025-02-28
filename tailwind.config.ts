import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: '#EAEAEA',
        muted: '#666666',
      },
      borderRadius: {
        'lg': '1rem',
        'md': '0.75rem',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}

export default config 