// src/theme/index.ts
var ThemeType = {
  Dark: "dark",
  Light: "light"
};

class Theme {
  #currentTheme = ThemeType.Dark;
  get() {
    return this.#currentTheme;
  }
  set(theme) {
    this.#currentTheme = theme;
  }
}
export {
  ThemeType
};

//# debugId=E6BE7DA2EBC5B52464756E2164756E21
//# sourceMappingURL=index.js.map
