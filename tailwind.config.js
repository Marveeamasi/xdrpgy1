/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'max-md': { max: '1000px' },
        'max-sm': { max: '639px' },
        'max-xsm': { max: '360px' },
    },
    animation: {
      'spin-slow': 'spin 3s linear infinite',
    }
  },
  plugins: [],
}
};
