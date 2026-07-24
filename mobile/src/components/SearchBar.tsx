import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { AppIcon } from "./AppIcon";
import { colors, MIN_TOUCH_SIZE, spacing } from "../theme";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({ value, onChangeText }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.inputShell}>
        <AppIcon name="search" size={21} color={colors.accent} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={t("list.searchPlaceholder")}
          placeholderTextColor={colors.textMuted}
          accessibilityLabel={t("list.searchPlaceholder")}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          style={styles.input}
        />
        {value.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("list.clearSearch")}
            hitSlop={4}
            onPress={() => onChangeText("")}
            style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}
          >
            <AppIcon name="close" size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  inputShell: {
    minHeight: MIN_TOUCH_SIZE,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.75)",
    backgroundColor: colors.card,
    fontSize: 16,
    color: colors.text,
    shadowColor: "#001B44",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 4,
  },
  input: {
    flex: 1,
    minHeight: MIN_TOUCH_SIZE,
    paddingVertical: 0,
    fontSize: 16,
    color: colors.text,
  },
  clearButton: {
    width: MIN_TOUCH_SIZE,
    height: MIN_TOUCH_SIZE,
    marginRight: -spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.5,
  },
});
