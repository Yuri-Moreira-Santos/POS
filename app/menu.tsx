import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, shadows } from "../src/theme";

interface MenuItemProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
}

function MenuItem({ label, icon, onPress, disabled }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={[styles.menuButton, disabled && styles.menuButtonDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <Ionicons
        name={icon}
        size={28}
        color={disabled ? colors.divider : colors.textIcons}
      />
      <Text style={[styles.menuButtonText, disabled && styles.menuButtonTextDisabled]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function Menu() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>E-Comercial</Text>
        <Text style={styles.headerSubtitle}>Selecione uma opção</Text>
      </View>

      <View style={styles.content}>
        <MenuItem
          label="Abastecimentos"
          icon="water"
          onPress={() => router.push("/abastecimentos")}
        />
        <MenuItem
          label="Produtos"
          icon="cube-outline"
          onPress={() => {}}
          disabled
        />
        <MenuItem
          label="???"
          icon="help-circle-outline"
          onPress={() => {}}
          disabled
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.darkPrimary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textIcons,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
    justifyContent: "center",
  },
  menuButton: {
    backgroundColor: colors.darkPrimary,
    borderRadius: radius.md,
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    ...shadows.elevated,
  },
  menuButtonDisabled: {
    backgroundColor: colors.primary,
    opacity: 0.6,
  },
  menuButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textIcons,
    letterSpacing: 0.5,
  },
  menuButtonTextDisabled: {
    color: colors.lightPrimary,
  },
});
