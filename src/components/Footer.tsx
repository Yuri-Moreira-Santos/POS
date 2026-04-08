import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../theme";
import { turnoAtual } from "../mock/data";

export function Footer() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{turnoAtual.versao}</Text>
      <Text style={styles.text}>Responsavel pelo turno</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  text: {
    fontSize: 12,
    color: colors.secondaryText,
  },
});
