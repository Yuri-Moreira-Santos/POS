import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, shadows, spacing, typography } from "../theme";
import type { Abastecimento } from "../mock/data";

interface AbastecimentoCardProps {
  item: Abastecimento;
  onPress: (item: Abastecimento) => void;
}

export function AbastecimentoCard({ item, onPress }: AbastecimentoCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${item.bomba} ${item.bico} - ${item.combustivel} - R$ ${item.preco.toFixed(2)}`}
    >
      <View style={styles.header}>
        <Text style={[typography.h3]}>{`${item.bomba} - ${item.bico}`}</Text>
        <Text style={typography.body2}>{item.hora}</Text>
      </View>
      <Text style={[typography.body2, styles.combustivel]}>{item.combustivel}</Text>
      <View style={styles.footer}>
        <View style={styles.litros}>
          <Ionicons name="water-outline" size={16} color={colors.secondaryText} />
          <Text style={typography.body1}>{item.litros.toLocaleString("pt-BR")} L</Text>
        </View>
        <Text style={typography.price}>
          R$ {item.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.card,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  combustivel: {
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  litros: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
});
