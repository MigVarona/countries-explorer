import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { AppIcon } from "./AppIcon";
import { colors, MIN_TOUCH_SIZE, spacing } from "../theme";

export function LoadingView() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.panel} accessibilityRole="progressbar">
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.message}>{t("states.loading")}</Text>
      </View>
    </View>
  );
}

/** `message` replaces the default hint, e.g. when no favourites are saved yet. */
export function EmptyView({ message }: { message?: string } = {}) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <View style={styles.iconSoft}>
          <AppIcon name="empty" size={32} color={colors.accent} />
        </View>
        <Text style={styles.title}>{t("states.empty")}</Text>
        <Text style={styles.message}>{message ?? t("states.emptyHint")}</Text>
      </View>
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
      <View style={styles.panel} accessibilityRole="alert">
        <View style={[styles.iconSoft, styles.iconDanger]}>
          <AppIcon name="error" size={32} color={colors.danger} />
        </View>
        <Text style={[styles.title, styles.errorTitle]}>{t("states.errorTitle")}</Text>
        <Text style={styles.message}>{t("states.error")}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("states.retry")}
          onPress={onRetry}
          style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
        >
          <Text style={styles.retryLabel}>{t("states.retry")}</Text>
        </Pressable>
      </View>
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
  panel: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.xl,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.card,
    shadowColor: "#12335B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  iconSoft: {
    width: 62,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 31,
    backgroundColor: colors.accentSoft,
  },
  iconDanger: {
    backgroundColor: "#FEF0EE",
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
    borderRadius: 14,
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
