import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const typography = StyleSheet.create({
  h1: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primaryText,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.primaryText,
  },
  h3: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primaryText,
  },
  body1: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.primaryText,
    lineHeight: 20,
  },
  body2: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.secondaryText,
    lineHeight: 18,
  },
  caption: {
    fontSize: 11,
    fontWeight: "400",
    color: colors.secondaryText,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.secondaryText,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.accent,
  },
  priceLarge: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.accent,
  },
  button: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
