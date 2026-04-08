import {
  View,
  Text,
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
import { abastecimentosPendentes, type FormaPagamento } from "../src/mock/data";
import { useState } from "react";

interface FormaPagamentoOption {
  id: FormaPagamento;
  label: string;
  icon?: string;
  isPix?: boolean;
}

const formasPagamento: FormaPagamentoOption[] = [
  { id: "pix", label: "PIX", isPix: true },
  { id: "credito", label: "Crédito" },
  { id: "debito", label: "Débito" },
  { id: "dinheiro", label: "Dinheiro" },
];

export default function Pagamento() {
  const router = useRouter();
  const { id, itens, total, cpf, cnpj } = useLocalSearchParams<{
    id: string;
    itens: string;
    total: string;
    cpf: string;
    cnpj: string;
  }>();

  const abastecimento = abastecimentosPendentes.find((a) => a.id === id) ?? abastecimentosPendentes[0];
  const totalValue = parseFloat(total ?? "0");

  const [formaSelecionada, setFormaSelecionada] = useState<FormaPagamento | null>(null);

  function handleContinuar() {
    if (!formaSelecionada) return;
    if (formaSelecionada === "pix") {
      router.push({
        pathname: "/pagamento-pix",
        params: { id, total, cpf, cnpj },
      });
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Tela Posto - Selecionar forma de pagamento"
        showBack
        onBackPress={() => router.back()}
      />
      <View style={styles.content}>
        <View style={styles.resumoCard}>
          <Text style={[typography.h3, styles.resumoTitle]}>Resumo</Text>
          <View style={styles.resumoItem}>
            <Text style={typography.h3}>{`${abastecimento.bomba} - ${abastecimento.bico}`}</Text>
            <View style={styles.resumoRow}>
              <Text style={typography.body2}>{abastecimento.combustivel}</Text>
              <Text style={typography.body2}>{abastecimento.hora}</Text>
            </View>
            <Text style={typography.body2}>Aditivo + itens</Text>
            <View style={styles.resumoTotal}>
              <Text style={typography.body2}>Total</Text>
              <Text style={typography.price}>
                R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>

        <Text style={[typography.body1, styles.formaTitle]}>Forma de Pagamento</Text>
        <View style={styles.formasGrid}>
          {formasPagamento.map((forma) => {
            const isSelected = formaSelecionada === forma.id;
            return (
              <TouchableOpacity
                key={forma.id}
                style={[styles.formaBtn, isSelected && styles.formaBtnSelected]}
                onPress={() => setFormaSelecionada(forma.id)}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel={`Forma de pagamento: ${forma.label}`}
                accessibilityState={{ selected: isSelected }}
              >
                {forma.isPix && (
                  <PixIcon color={isSelected ? colors.textIcons : colors.accent} />
                )}
                <Text
                  style={[
                    typography.h3,
                    { color: isSelected ? colors.textIcons : colors.primaryText },
                  ]}
                >
                  {forma.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={typography.body2}>Subtotal</Text>
            <Text style={[typography.body1, { color: colors.accent }]}>
              R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={[styles.totalRow, styles.totalGeral]}>
            <Text style={typography.h3}>TOTAL GERAL</Text>
            <Text style={typography.priceLarge}>
              R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

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
            disabled={!formaSelecionada}
            style={{ flex: 1 }}
          />
        </View>
      </View>
      <Footer />
    </SafeAreaView>
  );
}

function PixIcon({ color }: { color: string }) {
  return (
    <View style={{ width: 28, height: 28 }}>
      <Ionicons name="diamond-outline" size={28} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  resumoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    ...shadows.card,
  },
  resumoTitle: {
    marginBottom: spacing.sm,
  },
  resumoItem: {
    gap: 4,
  },
  resumoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resumoTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  formaTitle: {
    fontWeight: "600",
  },
  formasGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  formaBtn: {
    flex: 1,
    minWidth: "45%",
    height: 64,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.divider,
    ...shadows.card,
  },
  formaBtnSelected: {
    backgroundColor: colors.darkPrimary,
    borderColor: colors.darkPrimary,
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
  },
});
