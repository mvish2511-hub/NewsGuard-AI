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
          dark: '#f8fafc',  // clean light background (slate-50)
          card: '#ffffff',  // pure white card backgrounds
          border: '#e2e8f0', // light border (slate-200)
          text: '#475569',  // dark slate text (slate-600)
          glow: '#2563eb',  // vibrant corporate blue (blue-600)
          purple: '#7c3aed', // rich violet (violet-600)
          emerald: '#10b981', // emerald success
          rose: '#ef4444',    // rose danger
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
