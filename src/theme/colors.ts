export const colors = {
  darkPrimary: "#455A64",
  lightPrimary: "#CFD8DC",
  primary: "#607D8B",
  textIcons: "#FFFFFF",
  accent: "#009688",
  primaryText: "#212121",
  secondaryText: "#757575",
  divider: "#BDBDBD",

  background: "#F5F5F5",
  surface: "#FFFFFF",
  error: "#D32F2F",
  success: "#009688",
  warning: "#F57C00",

  pago: "#009688",
  faturado: "#607D8B",
} as const;

export type ColorKey = keyof typeof colors;
