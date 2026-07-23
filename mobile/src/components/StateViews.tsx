import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, MIN_TOUCH_SIZE, spacing } from "../theme";

export function LoadingView() {
  const { t } = useTranslation();
  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={styles.message}>{t("states.loading")}</Text>
    </View>
  );
}

export function EmptyView() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("states.empty")}</Text>
      <Text style={styles.message}>{t("states.emptyHint")}</Text>
    </View>
  );
}

interface ErrorViewProps {
  onRetry: () => void;
}

export function ErrorView({ onRetry }: ErrorViewProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles.errorTitle]}>{t("states.error")}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("states.retry")}
        onPress={onRetry}
        style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
      >
        <Text style={styles.retryLabel}>{t("states.retry")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    padding: spacing.xl,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },
  errorTitle: {
    color: colors.danger,
  },
  message: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
  },
  retryButton: {
    minHeight: MIN_TOUCH_SIZE,
    minWidth: MIN_TOUCH_SIZE * 2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    borderRadius: 10,
    backgroundColor: colors.accent,
  },
  pressed: {
    opacity: 0.7,
  },
  retryLabel: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
