// tailwind.config.js
import daisyui from 'daisyui';

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,
    require('@tailwindcss/line-clamp'), 
  ],
  daisyui: {
    themes: ["light", "synthwave"],
  },
};
