/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {},
      keyframes: {
        'bounce-horizontal': {
          '0%': {
            transform: 'translateX(0) scaleX(1)'
          },
          '45%': {
            transform: 'translateX(calc(300% - 4rem)) scaleX(1)'
          },
          '50%': {
            transform: 'translateX(calc(300% - 4rem)) scaleX(-1)'
          },
          '95%': {
            transform: 'translateX(0) scaleX(-1)'
          },
          '100%': {
            transform: 'translateX(0) scaleX(1)'
          }
        }
      },
      animation: {
        'bounce-horizontal': 'bounce-horizontal 8s ease-in-out infinite'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}

