export const ThemeType = {
  Dark: 'dark',
  Light: 'light',
} as const;

export type ThemeType = typeof ThemeType[keyof typeof ThemeType];

class Theme {
  #currentTheme: ThemeType = ThemeType.Dark;

  get(): ThemeType {
    return this.#currentTheme;
  }

  set(theme: ThemeType): void {
    this.#currentTheme = theme;
  }
}

export default Theme;
