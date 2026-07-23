import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text } from "react-native";

import { setAppLanguage, type AppLanguage } from "../i18n";
import { colors, MIN_TOUCH_SIZE } from "../theme";

/** Header button that toggles between English and Spanish. */
export function LanguageToggle() {
  const { t, i18n } = useTranslation();
  const nextLanguage: AppLanguage = i18n.language === "es" ? "en" : "es";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t("language.switchTo")}
      onPress={() => void setAppLanguage(nextLanguage)}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{nextLanguage.toUpperCase()}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: MIN_TOUCH_SIZE,
    minHeight: MIN_TOUCH_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.accent,
  },
});
