module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        '2xl': '1780px',    // змінюємо 2xl на 1580px
      },
      colors: {
        primary: "#1F3A93",     // колір кнопок, якщо такий у макеті
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
