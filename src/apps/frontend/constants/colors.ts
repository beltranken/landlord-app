const palette = {
  primary: "#0F2D2E",
  secondary: "#2E4D43",
  tertiary: "#C29547",
  neutral: "#F8FAFB",

  surface: "#f8fafb",

  base: "#FBF6EF",
  dark: "#3E2C23",
  accent: "#E76F2E",
} as const;

const white = "#ffffff" as const;

export const Colors = {
  background: palette.neutral,
  invertedBackground: palette.primary,
  surface: white,

  white,

  text: "#414848",
  textError: "#BA1A1A",

  button: palette.primary,
  buttonText: white,

  buttonSecondary: "#F2F4F5",

  highlight: palette.accent,
} as const;
