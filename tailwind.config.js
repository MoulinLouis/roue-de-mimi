/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        fairy: {
          cream: "#FFF7FB",
          blush: "#FBD7E4",
          petal: "#F4A6C0",
          rose: "#EC7FA9",
          deep: "#B24473",
          mint: "#B9E3C6",
          sage: "#7BB79B",
          forest: "#3A6B55",
          gem: "#E24A6A",
          star: "#FFE8A3",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', "serif"],
        body: ['"Quicksand"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        dreamy: "0 20px 60px -20px rgba(178, 68, 115, 0.35)",
        gem: "0 0 30px rgba(226, 74, 106, 0.55)",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        twinkle: "twinkle 3s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
      },
    },
  },
  plugins: [],
};
