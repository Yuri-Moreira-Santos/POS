import { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Animated,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "../src/components/Header";
import { AppStatusBar } from "../src/components/StatusBar";
import { Footer } from "../src/components/Footer";
import { AbastecimentoCard } from "../src/components/AbastecimentoCard";
import { AbastecimentoProcessadoItem } from "../src/components/AbastecimentoProcessadoItem";
import { colors, spacing, typography, radius } from "../src/theme";
import {
  abastecimentosPendentes,
  abastecimentosProcessados,
  type Abastecimento,
} from "../src/mock/data";

export default function Abastecimentos() {
  const router = useRouter();
  const { successMsg } = useLocalSearchParams<{ successMsg?: string }>();

  const bannerOpacity = useRef(new Animated.Value(0)).current;
  const bannerTranslate = useRef(new Animated.Value(-48)).current;

  useEffect(() => {
    if (!successMsg) return;
    Animated.sequence([
      Animated.parallel([
        Animated.timing(bannerOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(bannerTranslate, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]),
      Animated.delay(3000),
      Animated.parallel([
        Animated.timing(bannerOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(bannerTranslate, { toValue: -48, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();
  }, [successMsg]);

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

      {successMsg && (
        <Animated.View
          style={[
            styles.banner,
            { opacity: bannerOpacity, transform: [{ translateY: bannerTranslate }] },
          ]}
        >
          <Ionicons name="checkmark-circle" size={18} color={colors.textIcons} />
          <Text style={styles.bannerText}>{successMsg}</Text>
        </Animated.View>
      )}

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
  banner: {
    backgroundColor: colors.accent,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  bannerText: {
    color: colors.textIcons,
    fontSize: 14,
    fontWeight: "600",
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
