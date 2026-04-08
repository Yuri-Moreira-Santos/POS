import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "../src/components/Header";
import { Footer } from "../src/components/Footer";
import { Button } from "../src/components/Button";
import { colors, spacing, typography, radius, shadows } from "../src/theme";
import { abastecimentosPendentes, type ItemAdicional } from "../src/mock/data";

function getDigits(value: string) {
  return value.replace(/\D/g, "");
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

type TipoDocumento = "cpf" | "cnpj" | null;

function detectTipo(value: string): TipoDocumento {
  const digits = getDigits(value);
  if (digits.length === 11) return "cpf";
  if (digits.length === 14) return "cnpj";
  return null;
}

function getPlaceholder(digits: number): string {
  if (digits > 11) return "00.000.000/0000-00";
  return "000.000.000-00";
}

export default function IdentificarCliente() {
  const router = useRouter();
  const { id, itens, total } = useLocalSearchParams<{
    id: string;
    itens: string;
    total: string;
  }>();

  const abastecimento =
    abastecimentosPendentes.find((a) => a.id === id) ??
    abastecimentosPendentes[0];

  const itensAdicionais: ItemAdicional[] = itens ? JSON.parse(itens) : [];
  const totalValue = parseFloat(total ?? "0");
  const temItensAdicionais = itensAdicionais.length > 0;

  const [documento, setDocumento] = useState("");

  const digitCount = getDigits(documento).length;
  const tipoDetectado = detectTipo(documento);
  const documentoValido = tipoDetectado !== null;

  function handleChangeDocumento(value: string) {
    const raw = getDigits(value);
    if (raw.length > 14) return;
    setDocumento(formatDocumento(value));
  }

  function handleContinuar(semDocumento = false) {
    const cpf = !semDocumento && tipoDetectado === "cpf" ? documento : "";
    const cnpj = !semDocumento && tipoDetectado === "cnpj" ? documento : "";
    router.push({
      pathname: "/pagamento",
      params: { id, itens, total, cpf, cnpj },
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Tela Posto - Identificar Cliente"
        showBack
        onBackPress={() => router.back()}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formCard}>
            <Text style={[typography.h3, styles.formTitle]}>
              Identificar Cliente
            </Text>
            <Text style={[typography.body2, styles.formSubtitle]}>
              Informe CPF ou CNPJ do cliente para nota fiscal
            </Text>

            <Text style={styles.inputLabel}>CPF / CNPJ</Text>
            <View
              style={[
                styles.inputWrapper,
                documentoValido && styles.inputWrapperValid,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder={getPlaceholder(digitCount)}
                placeholderTextColor={colors.divider}
                value={documento}
                onChangeText={handleChangeDocumento}
                keyboardType="numeric"
                maxLength={18}
                accessibilityLabel="CPF ou CNPJ do cliente"
              />
              {documentoValido ? (
                <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
              ) : digitCount > 0 ? (
                <Text style={styles.tipoHint}>
                  {digitCount < 11
                    ? `${11 - digitCount} dígitos p/ CPF`
                    : `${14 - digitCount} dígitos p/ CNPJ`}
                </Text>
              ) : null}
            </View>
            {documentoValido && (
              <Text style={styles.tipoLabel}>
                {tipoDetectado === "cpf" ? "CPF identificado" : "CNPJ identificado"}
              </Text>
            )}
          </View>

          <Button
            label="Continuar sem CPF/CNPJ"
            variant="secondary"
            onPress={() => handleContinuar(true)}
          />

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
              onPress={() => handleContinuar(false)}
              disabled={!documentoValido}
              style={{ flex: 1 }}
            />
          </View>

          <View style={styles.previewSection}>
            <Text style={[typography.label, { marginBottom: spacing.sm }]}>
              Abastecimento a processar
            </Text>
            <View style={styles.previewCard}>
              <Text style={typography.h3}>
                {`${abastecimento.bomba} - ${abastecimento.bico}`}
              </Text>
              <View style={styles.previewRow}>
                <Text style={typography.body2}>{abastecimento.combustivel}</Text>
                <Text style={typography.body2}>{abastecimento.hora}</Text>
              </View>
              <View style={styles.previewFooter}>
                <View style={styles.litros}>
                  <Ionicons
                    name="water-outline"
                    size={16}
                    color={colors.secondaryText}
                  />
                  <Text style={typography.body1}>
                    {abastecimento.litros.toLocaleString("pt-BR")} L
                  </Text>
                </View>
                <Text style={typography.price}>
                  R${" "}
                  {abastecimento.preco.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>

              {temItensAdicionais && (
                <View style={styles.itensSection}>
                  <View style={styles.itensDivider} />
                  <Text style={[typography.body2, styles.itensLabel]}>
                    + Itens adicionais
                  </Text>
                  {itensAdicionais.map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                      <Text style={typography.body2}>
                        {item.nome}
                        {item.tipo ? ` ${item.tipo}` : ""}
                        {item.quantidade > 1 ? ` ×${item.quantidade}` : ""}
                      </Text>
                      <Text
                        style={[
                          typography.body2,
                          { color: colors.accent, fontWeight: "600" },
                        ]}
                      >
                        R${" "}
                        {(item.preco * item.quantidade).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                    </View>
                  ))}
                  <View style={styles.itensDivider} />
                  <View style={styles.totalRow}>
                    <Text style={[typography.body1, { fontWeight: "700" }]}>
                      Total geral
                    </Text>
                    <Text style={typography.priceLarge}>
                      R${" "}
                      {totalValue.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </Text>
                  </View>
                </View>
              )}

              {!temItensAdicionais && (
                <View style={styles.totalSimples}>
                  <Text style={typography.body2}>Total</Text>
                  <Text style={typography.price}>
                    R${" "}
                    {totalValue.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    ...shadows.card,
  },
  formTitle: {
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    marginBottom: spacing.md,
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
    backgroundColor: colors.surface,
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
    marginLeft: spacing.xs,
  },
  tipoLabel: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: "500",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  previewSection: {},
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    ...shadows.card,
    gap: 4,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  previewFooter: {
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
  itensSection: {
    marginTop: spacing.sm,
    gap: 6,
  },
  itensDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 4,
  },
  itensLabel: {
    fontWeight: "600",
    color: colors.primaryText,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalSimples: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
