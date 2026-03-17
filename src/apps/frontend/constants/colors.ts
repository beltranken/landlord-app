const palette = {
  base: "#FBF6EF",
  dark: "#3E2C23",
  primary: "#2FA4D7",
  accent: "#E76F2E",
} as const;

const white = "#ffffff" as const;

export const Colors = {
  background: palette.base,
  invertedBackground: palette.primary,
  surface: white,

  text: palette.dark,

  button: palette.primary,
  buttonText: white,

  highlight: palette.accent,
} as const;
