// eslint-disable-next-line
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  theme: {
    colors: {
      primary: "#a1278c",
      secondary: "#e9c1db",
      ...defaultTheme.colors
    }
  }
};
