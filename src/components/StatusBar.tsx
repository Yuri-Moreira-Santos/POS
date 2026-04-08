import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../theme";

interface StatusBarProps {
  connected: boolean;
  caixaAberto: boolean;
}

export function AppStatusBar({ connected, caixaAberto }: StatusBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Ionicons
          name={connected ? "checkmark-circle" : "close-circle"}
          size={16}
          color={connected ? colors.accent : colors.error}
        />
        <Text style={styles.text}>{connected ? "Conectado" : "Desconectado"}</Text>
      </View>
      <View style={styles.item}>
        <Ionicons
          name={caixaAberto ? "checkmark-circle" : "close-circle"}
          size={16}
          color={caixaAberto ? colors.accent : colors.error}
        />
        <Text style={styles.text}>{caixaAberto ? "Caixa Aberto" : "Caixa Fechado"}</Text>
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  text: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.primaryText,
  },
});
