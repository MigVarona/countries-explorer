import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { colors, MIN_TOUCH_SIZE, spacing } from "../theme";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({ value, onChangeText }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={t("list.searchPlaceholder")}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={t("list.searchPlaceholder")}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        returnKeyType="search"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  input: {
    minHeight: MIN_TOUCH_SIZE,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    fontSize: 16,
    color: colors.text,
  },
});
