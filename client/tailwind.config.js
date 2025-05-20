module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F5F7FA",     // колір кнопок, якщо такий у макеті
        accent: "#F39C12",      // акцентні елементи
        background: "#F5F7FA",  // фон
        secondary: "#7DCBFF", // колір вторинних елементів
        errorColor: "#FF4548", // колір помилок
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
    	},
      spacing: {
        18: "4.5rem", // якщо в макеті є нестандартні відступи
      },
    },
  },
  plugins: [],
};
