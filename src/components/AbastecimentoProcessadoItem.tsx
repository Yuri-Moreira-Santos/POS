import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../theme";
import type { Abastecimento } from "../mock/data";

interface AbastecimentoProcessadoItemProps {
  item: Abastecimento;
}

export function AbastecimentoProcessadoItem({ item }: AbastecimentoProcessadoItemProps) {
  const isPago = item.status === "pago";

  return (
    <View style={styles.row}>
      <Text style={[typography.body2, styles.bomba]} numberOfLines={1}>
        {`${item.bomba} - ${item.bico}`}
      </Text>
      <Text style={styles.litros}>
        {item.litros.toLocaleString("pt-BR")} L
      </Text>
      <Text style={styles.separator}>|</Text>
      <Text style={[styles.preco, { color: isPago ? colors.accent : colors.primary }]}>
        R$ {item.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </Text>
      <View style={styles.badge}>
        <Text style={[styles.badgeText, { color: isPago ? colors.accent : colors.primary }]}>
          {isPago ? "Pago" : "Faturado"}
        </Text>
        {isPago ? (
          <Ionicons name="checkmark-circle" size={16} color={colors.accent} />
        ) : (
          <Ionicons name="receipt-outline" size={16} color={colors.primary} />
        )}
      </View>
      <Text style={typography.caption}>{item.hora}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    gap: 6,
    flexWrap: "nowrap",
  },
  bomba: {
    flex: 1,
    minWidth: 80,
  },
  litros: {
    fontSize: 12,
    color: colors.secondaryText,
    minWidth: 40,
  },
  separator: {
    color: colors.divider,
    fontSize: 12,
  },
  preco: {
    fontSize: 13,
    fontWeight: "600",
    minWidth: 70,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
