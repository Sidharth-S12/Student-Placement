/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#dce5f2',
          200: '#b8cde6',
          300: '#8baed5',
          400: '#5c8bc0',
          500: '#3a6fa9',
          600: '#2b578c',
          700: '#234470',
          800: '#1b3355',
          850: '#13233c',
          900: '#0c182a',
          950: '#070e1b',
        },
        brand: {
          50: '#eef6ff',
          100: '#d9ebff',
          200: '#bcdbff',
          300: '#8ec3ff',
          400: '#599eff',
          500: '#2f74fc',
          600: '#1e54f0',
          700: '#163edc',
          800: '#1733b2',
          900: '#182f8c',
          950: '#0e1a53',
        },
        slate: {
          750: '#243044',
          850: '#151f32',
          900: '#0f172a',
          950: '#090d16',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Times New Roman"', 'Times', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 8px 24px -4px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.03)',
        'elevated': '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.03)',
        'glow': '0 0 20px -2px rgba(37, 99, 235, 0.25)',
      }
    },
  },
  plugins: [],
}
