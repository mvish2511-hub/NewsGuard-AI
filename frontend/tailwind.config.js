/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#030712',  // deep rich black (slate-950)
          card: '#0b0f19',  // sleek dark card surface
          cardHover: '#111827',
          border: '#1e293b', // subtle dark slate border
          borderGlow: '#334155',
          text: '#94a3b8',  // clear slate text
          glow: '#3b82f6',  // electric blue
          cyan: '#06b6d4',  // glowing cyan
          purple: '#8b5cf6', // luminous purple
          emerald: '#10b981', // emerald success
          rose: '#f43f5e',    // rose danger
          amber: '#f59e0b',   // amber warning
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
