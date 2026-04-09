import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
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
  const abastecimento =
    abastecimentosPendentes.find((a) => a.id === id) ?? abastecimentosPendentes[0];

  const [itens, setItens] = useState<ItemAdicional[]>([]);
  const [modalPlacaVisible, setModalPlacaVisible] = useState(false);
  const [placa, setPlaca] = useState("");

  function handleAddItem() {
    const primeiroDisponivel = itensAdicionaisDisponiveis.find(
      (d) => !itens.find((i) => i.id === d.id)
    );
    if (primeiroDisponivel) {
      setItens((prev) => [...prev, { ...primeiroDisponivel, quantidade: 1 }]);
    }
  }

  function handleChangeQuantidade(itemId: string, delta: number) {
    setItens((prev) =>
      prev
        .map((i) => (i.id === itemId ? { ...i, quantidade: i.quantidade + delta } : i))
        .filter((i) => i.quantidade > 0)
    );
  }

  const subtotal =
    abastecimento.preco + itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);

  function navegarParaPagamento(faturado = false, placaValue = "") {
    router.push({
      pathname: "/pagamento",
      params: {
        id: abastecimento.id,
        itens: JSON.stringify(itens),
        total: subtotal.toString(),
        faturado: faturado ? "1" : "0",
        placa: placaValue,
      },
    });
  }

  function handleContinuar() {
    navegarParaPagamento(false);
  }

  function handleClienteFaturadoConfirmar() {
    setModalPlacaVisible(false);
    navegarParaPagamento(true, placa);
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
            <View style={styles.rowBetween}>
              <Text style={typography.body2}>{abastecimento.combustivel}</Text>
              <Text style={typography.body2}>{abastecimento.hora}</Text>
            </View>
            <View style={styles.rowBetween}>
              <View style={styles.litros}>
                <Ionicons name="water-outline" size={16} color={colors.secondaryText} />
                <Text style={typography.body1}>
                  {abastecimento.litros.toLocaleString("pt-BR")} L
                </Text>
                <Text style={[typography.body2, { marginLeft: 4 }]}>
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
            <Text style={[typography.body2, styles.itensLabel]}>+ Itens Adicionais</Text>
            {itens.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={typography.body1}>
                    {item.nome}
                    {item.tipo ? ` ${item.tipo}` : ""}
                  </Text>
                  <Text style={[typography.body2, { color: colors.accent }]}>
                    R$ {item.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} x
                    {item.quantidade}
                  </Text>
                </View>
                <View style={styles.quantidadeControl}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleChangeQuantidade(item.id, -1)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityLabel="Diminuir"
                    accessibilityRole="button"
                  >
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.quantidade}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleChangeQuantidade(item.id, 1)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityLabel="Aumentar"
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
          <Text style={[typography.body1, { fontWeight: "600" }]}>Adicionar Item</Text>
        </TouchableOpacity>

        <Button
          label="Cliente Faturado"
          variant="secondary"
          onPress={() => setModalPlacaVisible(true)}
        />

        <View style={styles.totals}>
          <View style={styles.rowBetween}>
            <Text style={typography.body2}>Subtotal</Text>
            <Text style={[typography.body1, { color: colors.accent }]}>
              R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={[styles.rowBetween, styles.totalGeral]}>
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

      <Modal
        visible={modalPlacaVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalPlacaVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Ionicons name="checkmark-circle" size={28} color={colors.accent} />
              <Text style={[typography.h3, styles.modalTitle]}>Cliente faturado</Text>
            </View>
            <Text style={[typography.body2, styles.modalSubtitle]}>
              Informe a placa do veiculo
            </Text>

            <Text style={styles.inputLabel}>Placa</Text>
            <TextInput
              style={styles.input}
              placeholder="AAA-0000"
              placeholderTextColor={colors.divider}
              value={placa}
              onChangeText={(v) => setPlaca(v.toUpperCase().slice(0, 8))}
              autoCapitalize="characters"
              maxLength={8}
              accessibilityLabel="Placa do veículo"
            />

            <View style={styles.modalActions}>
              <Button
                label="Cancelar"
                variant="outline"
                onPress={() => {
                  setModalPlacaVisible(false);
                  setPlaca("");
                }}
                style={{ flex: 1 }}
              />
              <Button
                label="Continuar"
                variant="primary"
                onPress={handleClienteFaturadoConfirmar}
                disabled={placa.length < 7}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  litros: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  itensLabel: {
    fontWeight: "600",
    color: colors.primaryText,
    marginBottom: spacing.sm,
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
  totals: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.card,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    width: "100%",
    maxWidth: 400,
    gap: spacing.sm,
    ...shadows.elevated,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  modalTitle: {
    color: colors.primaryText,
  },
  modalSubtitle: {
    marginBottom: spacing.sm,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.primaryText,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: colors.divider,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    fontWeight: "600",
    color: colors.primaryText,
    letterSpacing: 2,
    outlineStyle: "none",
  } as any,
  modalActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
