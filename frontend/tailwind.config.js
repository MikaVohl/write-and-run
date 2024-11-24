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
      fontFamily: {
        'dancing-script': ['"Dancing Script"', 'cursive'],
      },
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
        },
        'fade-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'zoom-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)'
          },
        },
        'overlay-show': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'bounce-horizontal': 'bounce-horizontal 8s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s ease-out',
        'zoom-in': 'zoom-in 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'overlay-show': 'overlay-show 0.2s ease-out',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}

