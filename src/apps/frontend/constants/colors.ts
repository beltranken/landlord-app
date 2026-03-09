const main = {
  primary: "#3338A0",
  secondary: "#C59560",
  accent: "#FCC61D",
  neutral: "#F7F7F7",
  surface: "#F6EFF6",
};

const Colors = {
  ...main,
  neutrals: {
    50: "#F7F7F7",
    100: "#E5E5E5",
    200: "#D4D4D4",
    400: "#A3A3A3",
    600: "#737373",
    800: "#404040",
  },
  textPrimary: "#304050",
  accentGradient: ["#FF0080", "#7928CA"],
  surfaceGradient: ["#EAE6FA", "#F3E6FA"],
  white: "white",
  gray: "#EFE9E4",
} as const;

export default Colors;
