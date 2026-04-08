import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../theme";

interface HeaderProps {
  title: string;
  showMenu?: boolean;
  showBack?: boolean;
  onMenuPress?: () => void;
  onBackPress?: () => void;
}

export function Header({
  title,
  showMenu,
  showBack,
  onMenuPress,
  onBackPress,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      {showBack && (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onBackPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={colors.textIcons} />
        </TouchableOpacity>
      )}
      {showMenu && (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onMenuPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Menu"
          accessibilityRole="button"
        >
          <Ionicons name="menu" size={24} color={colors.textIcons} />
        </TouchableOpacity>
      )}
      <Text style={[typography.h3, styles.title]} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    color: colors.textIcons,
    flex: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
