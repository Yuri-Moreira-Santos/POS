import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "../src/components/Header";
import { Button } from "../src/components/Button";
import { colors, spacing, typography, radius, shadows } from "../src/theme";

const MOCK_QR_CODE_URL = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PIX-MOCK-TELA-POSTO-2026";

export default function PagamentoPix() {
  const router = useRouter();
  const { total } = useLocalSearchParams<{ total: string }>();
  const totalValue = parseFloat(total ?? "0");

  const [aguardando, setAguardando] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAguardando(false);
    }, 8000);
    return () => clearTimeout(timeout);
  }, []);

  function handleConfirmar() {
    setConfirming(true);
    setTimeout(() => {
      router.push("/");
    }, 1500);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Tela Posto - Abastecimentos pendentes" showMenu />
      <View style={styles.content}>
        <View style={styles.pixCard}>
          <View style={styles.pixHeader}>
            <PixSymbol />
            <Text style={[typography.h2, styles.pixTitle]}>PIX</Text>
          </View>

          <Text style={[typography.body1, styles.instruction]}>
            Escaneie o QR Code abaixo para pagar.
          </Text>

          <View style={styles.qrWrapper}>
            <Image
              source={{ uri: MOCK_QR_CODE_URL }}
              style={styles.qrCode}
              accessibilityLabel="QR Code PIX para pagamento"
              resizeMode="contain"
            />
          </View>

          {aguardando ? (
            <View style={styles.statusRow}>
              <ActivityIndicator size="small" color={colors.secondaryText} />
              <Text style={[typography.body2, styles.statusText]}>
                Aguardando pagamento...
              </Text>
            </View>
          ) : (
            <Text style={[typography.body1, styles.statusPago]}>
              Pagamento confirmado!
            </Text>
          )}
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
            onPress={handleConfirmar}
            loading={confirming}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function PixSymbol() {
  return <Ionicons name="diamond" size={40} color={colors.accent} />;
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
    justifyContent: "center",
  },
  pixCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.md,
    ...shadows.elevated,
  },
  pixHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  pixTitle: {
    color: colors.primaryText,
  },
  instruction: {
    textAlign: "center",
    color: colors.secondaryText,
  },
  qrWrapper: {
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  qrCode: {
    width: 200,
    height: 200,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  statusText: {
    color: colors.secondaryText,
  },
  statusPago: {
    color: colors.accent,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
});
