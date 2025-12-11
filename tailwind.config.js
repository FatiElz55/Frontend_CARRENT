/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        primary: '#4f46e5',
        secondary: '#a855f7',
        accent: '#38bdf8',
        bg: '#0f1020',
        light: '#f9fafb',
        muted: '#9ca3af',
      },
      backgroundImage: {
        'radial-dark': 'radial-gradient(circle at top left, #1f1338 0, #070917 40%, #050712 100%)',
        'radial-header': 'radial-gradient(circle at 0% 0%, #f9fafb, #a855f7 35%, #4f46e5 100%)',
        'gradient-header': 'linear-gradient(120deg, rgba(108, 70, 196, 0.85), rgba(59, 130, 246, 0.7))',
        'gradient-card': 'radial-gradient(circle at top, rgba(148, 163, 184, 0.15), rgba(15, 23, 42, 0.9))',
      },
      boxShadow: {
        'card': '0 18px 45px rgba(15, 23, 42, 0.85)',
        'brand': '0 8px 18px rgba(15, 23, 42, 0.5)',
        'primary-btn': '0 10px 25px rgba(79, 70, 229, 0.6)',
      },
      borderRadius: {
        'xl': '0.9rem',
        '2xl': '1rem',
        'full': '999px',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        fadeInUp: { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: 0, transform: 'scale(0.96)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '-120% 0' }, '100%': { backgroundPosition: '120% 0' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out forwards',
        fadeInUp: 'fadeInUp 0.28s ease-out forwards',
        scaleIn: 'scaleIn 0.2s ease-out forwards',
        shimmer: 'shimmer 1.4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
