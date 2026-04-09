import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "../src/components/Header";
import { Footer } from "../src/components/Footer";
import { Button } from "../src/components/Button";
import { colors, spacing, typography, radius, shadows } from "../src/theme";
import {
  abastecimentosPendentes,
  type FormaPagamento,
  type ItemAdicional,
} from "../src/mock/data";

const formasPagamento: { id: FormaPagamento; label: string; isPix?: boolean }[] = [
  { id: "pix", label: "PIX", isPix: true },
  { id: "credito", label: "Crédito" },
  { id: "debito", label: "Débito" },
  { id: "dinheiro", label: "Dinheiro" },
];

function getDigits(v: string) {
  return v.replace(/\D/g, "");
}

function formatDocumento(value: string): string {
  const digits = getDigits(value).slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  }
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
    .replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5");
}

function detectTipo(value: string): "cpf" | "cnpj" | null {
  const len = getDigits(value).length;
  if (len === 11) return "cpf";
  if (len === 14) return "cnpj";
  return null;
}

export default function Pagamento() {
  const router = useRouter();
  const { id, itens, total, faturado, placa, empresa, cnpjEmpresa } = useLocalSearchParams<{
    id: string;
    itens: string;
    total: string;
    faturado: string;
    placa: string;
    empresa: string;
    cnpjEmpresa: string;
  }>();

  const abastecimento =
    abastecimentosPendentes.find((a) => a.id === id) ?? abastecimentosPendentes[0];
  const totalValue = parseFloat(total ?? "0");
  const itensAdicionais: ItemAdicional[] = itens ? JSON.parse(itens) : [];
  const isFaturado = faturado === "1";

  const [formaSelecionada, setFormaSelecionada] = useState<FormaPagamento | null>(null);
  const [documento, setDocumento] = useState("");

  const tipoDetectado = detectTipo(documento);
  const digitCount = getDigits(documento).length;

  function handleContinuar() {
    if (isFaturado) {
      router.replace({
        pathname: "/abastecimentos",
        params: { successMsg: "Cliente faturado com sucesso" },
      });
      return;
    }
    if (!formaSelecionada) return;
    if (formaSelecionada === "pix") {
      router.push({
        pathname: "/pagamento-pix",
        params: { id, total },
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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={[typography.h3, { marginBottom: spacing.xs }]}>
            Identificar Cliente
          </Text>
          <Text style={[typography.body2, { marginBottom: spacing.md }]}>
            Informe CPF ou CNPJ do cliente para nota fiscal
          </Text>

          {isFaturado ? (
            <View style={styles.faturadoCard}>
              {empresa ? (
                <View style={styles.faturadoEmpresa}>
                  <Text style={styles.faturadoEmpresaNome}>{empresa}</Text>
                  <Text style={styles.faturadoEmpresaCnpj}>{cnpjEmpresa}</Text>
                </View>
              ) : null}
              <View style={styles.faturadoBadge}>
                <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
                <Text style={styles.faturadoText}>
                  Cliente Faturado — Placa: {placa || "—"}
                </Text>
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.inputLabel}>CPF ou CNPJ</Text>
              <View
                style={[
                  styles.inputWrapper,
                  tipoDetectado && styles.inputWrapperValid,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder={digitCount > 11 ? "00.000.000/0000-00" : "000.000.000-00"}
                  placeholderTextColor={colors.divider}
                  value={documento}
                  onChangeText={(v) => {
                    if (getDigits(v).length <= 14) setDocumento(formatDocumento(v));
                  }}
                  keyboardType="numeric"
                  maxLength={18}
                  accessibilityLabel="CPF ou CNPJ"
                />
                {tipoDetectado ? (
                  <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
                ) : digitCount > 0 ? (
                  <Text style={styles.tipoHint}>
                    {digitCount < 11
                      ? `${11 - digitCount} p/ CPF`
                      : `${14 - digitCount} p/ CNPJ`}
                  </Text>
                ) : null}
              </View>
              {tipoDetectado && (
                <Text style={styles.tipoLabel}>
                  {tipoDetectado === "cpf" ? "CPF identificado" : "CNPJ identificado"}
                </Text>
              )}
            </>
          )}
        </View>

        {!isFaturado && (
          <>
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
                    accessibilityLabel={forma.label}
                    accessibilityState={{ selected: isSelected }}
                  >
                    {forma.isPix && (
                      <Ionicons
                        name="diamond-outline"
                        size={22}
                        color={isSelected ? colors.textIcons : colors.accent}
                      />
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
          </>
        )}

        <View style={styles.card}>
          <Text style={[typography.h3, { marginBottom: spacing.sm }]}>Resumo</Text>
          <Text style={typography.h3}>{`${abastecimento.bomba} - ${abastecimento.bico}`}</Text>
          <View style={styles.rowBetween}>
            <Text style={typography.body2}>{abastecimento.combustivel}</Text>
            <Text style={typography.body2}>{abastecimento.hora}</Text>
          </View>
          {itensAdicionais.length > 0 && (
            <Text style={[typography.body2, { marginTop: 2 }]}>Aditivo + itens</Text>
          )}
          <View style={[styles.rowBetween, styles.totalResumoRow]}>
            <Text style={typography.body2}>Total</Text>
            <Text style={typography.price}>
              R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.rowBetween}>
            <Text style={typography.body2}>Subtotal</Text>
            <Text style={[typography.body1, { color: colors.accent }]}>
              R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={[styles.rowBetween, styles.totalGeral]}>
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
            label={isFaturado ? "Finalizar" : "Continuar"}
            variant="primary"
            onPress={handleContinuar}
            disabled={!isFaturado && !formaSelecionada}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    ...shadows.card,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.primaryText,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.divider,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  inputWrapperValid: {
    borderColor: colors.accent,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.primaryText,
    outlineStyle: "none",
  } as any,
  tipoHint: {
    fontSize: 11,
    color: colors.secondaryText,
  },
  tipoLabel: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: "500",
    marginTop: 4,
  },
  faturadoCard: {
    gap: spacing.sm,
  },
  faturadoEmpresa: {
    backgroundColor: `${colors.accent}15`,
    borderRadius: radius.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    padding: spacing.sm,
  },
  faturadoEmpresaNome: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primaryText,
  },
  faturadoEmpresaCnpj: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  faturadoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: `${colors.accent}18`,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  faturadoText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.accent,
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
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalResumoRow: {
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
  totalGeral: {
    paddingTop: spacing.xs,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
});
