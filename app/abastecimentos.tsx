import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { Header } from "../src/components/Header";
import { AppStatusBar } from "../src/components/StatusBar";
import { Footer } from "../src/components/Footer";
import { AbastecimentoCard } from "../src/components/AbastecimentoCard";
import { AbastecimentoProcessadoItem } from "../src/components/AbastecimentoProcessadoItem";
import { colors, spacing, typography } from "../src/theme";
import {
  abastecimentosPendentes,
  abastecimentosProcessados,
  type Abastecimento,
} from "../src/mock/data";

export default function Abastecimentos() {
  const router = useRouter();

  function handleAbastecimentoPress(item: Abastecimento) {
    router.push({
      pathname: "/resumo-compra",
      params: { id: item.id },
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Tela Posto - Abastecimentos pendentes" showMenu />
      <AppStatusBar connected caixaAberto />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[typography.label, styles.sectionTitle]}>
          Abastecimentos pendentes
        </Text>
        {abastecimentosPendentes.map((item) => (
          <AbastecimentoCard
            key={item.id}
            item={item}
            onPress={handleAbastecimentoPress}
          />
        ))}

        <Text style={[typography.label, styles.sectionTitle, styles.sectionTitleSpaced]}>
          Últimos Abastecimentos Processados
        </Text>
        <View style={styles.processadosCard}>
          {abastecimentosProcessados.map((item) => (
            <AbastecimentoProcessadoItem key={item.id} item={item} />
          ))}
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
  },
  sectionTitle: {
    color: colors.primaryText,
    marginBottom: spacing.sm,
  },
  sectionTitleSpaced: {
    marginTop: spacing.lg,
  },
  processadosCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
});
