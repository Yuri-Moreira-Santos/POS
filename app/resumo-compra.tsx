import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "../src/components/Header";
import { Footer } from "../src/components/Footer";
import { Button } from "../src/components/Button";
import { colors, spacing, typography, radius, shadows } from "../src/theme";
import {
  abastecimentosPendentes,
  itensAdicionaisDisponiveis,
  type ItemAdicional,
} from "../src/mock/data";

export default function ResumoCompra() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const abastecimento = abastecimentosPendentes.find((a) => a.id === id) ?? abastecimentosPendentes[0];

  const [itens, setItens] = useState<ItemAdicional[]>([]);

  function handleAddItem() {
    const primeiroDisponivel = itensAdicionaisDisponiveis.find(
      (d) => !itens.find((i) => i.id === d.id)
    );
    if (primeiroDisponivel) {
      setItens((prev) => [...prev, { ...primeiroDisponivel, quantidade: 1 }]);
    }
  }

  function handleChangeQuantidade(id: string, delta: number) {
    setItens((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantidade: i.quantidade + delta } : i))
        .filter((i) => i.quantidade > 0)
    );
  }

  const subtotal =
    abastecimento.preco +
    itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);

  function handleContinuar() {
    router.push({
      pathname: "/identificar-cliente",
      params: {
        id: abastecimento.id,
        itens: JSON.stringify(itens),
        total: subtotal.toString(),
      },
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Resumo da Compra" showBack onBackPress={() => router.back()} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[typography.h3, styles.sectionTitle]}>Abastecimento</Text>
          <View style={styles.abastecimentoCard}>
            <Text style={typography.h3}>{`${abastecimento.bomba} - ${abastecimento.bico}`}</Text>
            <View style={styles.abastecimentoRow}>
              <Text style={typography.body2}>{abastecimento.combustivel}</Text>
              <Text style={typography.body2}>{abastecimento.hora}</Text>
            </View>
            <View style={styles.abastecimentoFooter}>
              <View style={styles.litros}>
                <Ionicons name="water-outline" size={16} color={colors.secondaryText} />
                <Text style={typography.body1}>{abastecimento.litros.toLocaleString("pt-BR")} L</Text>
                <Text style={[typography.body2, styles.precoUnitario]}>
                  | R$ {(abastecimento.preco / abastecimento.litros).toFixed(2)}
                </Text>
              </View>
              <Text style={typography.price}>
                R$ {abastecimento.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>

        {itens.length > 0 && (
          <View style={styles.section}>
            <Text style={[typography.body2, styles.itensTitle]}>+ Itens Adicionais</Text>
            {itens.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={typography.body1}>
                    {item.nome}
                    {item.tipo ? ` ${item.tipo}` : ""}
                  </Text>
                  <Text style={[typography.body2, { color: colors.accent }]}>
                    R$ {item.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} x{item.quantidade}
                  </Text>
                </View>
                <View style={styles.quantidadeControl}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleChangeQuantidade(item.id, -1)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityLabel="Diminuir quantidade"
                    accessibilityRole="button"
                  >
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.quantidade}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleChangeQuantidade(item.id, 1)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityLabel="Aumentar quantidade"
                    accessibilityRole="button"
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={[typography.body2, styles.itemTotal]}>
                  Total R$ {(item.preco * item.quantidade).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.addItemBtn}
          onPress={handleAddItem}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Adicionar item"
        >
          <Ionicons name="add" size={20} color={colors.primaryText} />
          <Text style={[typography.body1, styles.addItemText]}>Adicionar Item</Text>
        </TouchableOpacity>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={typography.body2}>Subtotal</Text>
            <Text style={[typography.body1, { color: colors.accent }]}>
              R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={[styles.totalRow, styles.totalGeral]}>
            <Text style={typography.h3}>TOTAL GERAL</Text>
            <Text style={typography.priceLarge}>
              R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button
          label="Cancelar"
          variant="outline"
          onPress={() => router.back()}
          style={{ flex: 1 }}
        />
        <Button
          label="Continuar"
          variant="primary"
          onPress={handleContinuar}
          style={{ flex: 1 }}
        />
      </View>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    ...shadows.card,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  abastecimentoCard: {
    gap: 4,
  },
  abastecimentoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  abastecimentoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  litros: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  precoUnitario: {
    marginLeft: 4,
  },
  itensTitle: {
    marginBottom: spacing.sm,
    color: colors.primaryText,
    fontWeight: "600",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    gap: spacing.sm,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  quantidadeControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    backgroundColor: colors.darkPrimary,
    borderRadius: radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: {
    color: colors.textIcons,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 22,
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primaryText,
    minWidth: 20,
    textAlign: "center",
  },
  itemTotal: {
    minWidth: 80,
    textAlign: "right",
  },
  addItemBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.divider,
    paddingVertical: 14,
    ...shadows.card,
  },
  addItemText: {
    fontWeight: "600",
  },
  totals: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.card,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalGeral: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
