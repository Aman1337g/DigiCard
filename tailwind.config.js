export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        'slidein-pulse': {
          '40%, 80%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      animation: {
        'slidein-pulse': 'slidein-pulse 1s infinite',
      },
    }
  },
  plugins: [],
};
