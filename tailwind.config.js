/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          brown: "#7B5C45",
          brownLight: "#A67C5B",
          beige: "#C9A882",
          sand: "#E8D5BC",
          cream: "#F5EDE0",
          slate: "#8FA3A8",
          dark: "#2C2420",
        },
        // No estaba en tu paleta de marca - color de error, elegido para no chocar con los tonos tierra.
        alert: "#B0463A",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Big Shoulders Stencil", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
