import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { markWelcomeSeen } from "../src/onboarding";
import { colors, MIN_TOUCH_SIZE, spacing } from "../src/theme";

/** First-launch intro. The list (app/index.tsx) stays the app's entry route. */
export default function WelcomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Mark as seen on mount, so dismissing with the back gesture also counts.
  useEffect(() => {
    void markWelcomeSeen();
  }, []);

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <View style={[styles.orbit, styles.orbitTop]} />
      <View style={[styles.orbit, styles.orbitMiddle]} />
      <View style={styles.glow} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + spacing.xl,
            paddingBottom: insets.bottom + spacing.xl,
          },
        ]}
      >
        <View style={styles.hero}>
          <View style={styles.logoFrame}>
            <Image source={require("../assets/icon.png")} style={styles.logo} resizeMode="cover" />
          </View>
          <Text style={styles.eyebrow}>{t("welcome.eyebrow")}</Text>
          <Text style={styles.title}>{t("welcome.title")}</Text>
          <Text style={styles.subtitle}>{t("welcome.subtitle")}</Text>
        </View>

        <View style={styles.features}>
          <Feature icon="⌕" text={t("welcome.featureSearch")} />
          <Feature icon="★" text={t("welcome.featureFavorites")} />
          <Feature icon="◎" text={t("welcome.featureLanguages")} />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("welcome.start")}
          onPress={() => router.back()}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.buttonLabel}>{t("welcome.start")}</Text>
          <Text style={styles.buttonArrow} accessibilityElementsHidden>
            →
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.feature} accessible accessibilityLabel={text}>
      <View style={styles.featureIconFrame}>
        <Text style={styles.featureIcon}>{icon}</Text>
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: colors.brand,
  },
  content: {
    flexGrow: 1,
    justifyContent: "space-between",
    gap: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  orbit: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.11)",
    borderRadius: 999,
  },
  orbitTop: {
    width: 310,
    height: 310,
    top: -170,
    right: -105,
  },
  orbitMiddle: {
    width: 180,
    height: 180,
    top: 105,
    left: -105,
  },
  glow: {
    position: "absolute",
    width: 260,
    height: 260,
    right: -130,
    bottom: -80,
    borderRadius: 130,
    backgroundColor: "rgba(45,212,191,0.12)",
  },
  hero: {
    alignItems: "center",
    gap: spacing.sm,
  },
  logoFrame: {
    marginBottom: spacing.md,
    padding: 5,
    borderRadius: 31,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    backgroundColor: "rgba(255,255,255,0.12)",
    shadowColor: "#001B44",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 8,
  },
  logo: {
    width: 104,
    height: 104,
    borderRadius: 26,
  },
  eyebrow: {
    color: colors.aqua,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.8,
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    maxWidth: 330,
    marginTop: spacing.xs,
    fontSize: 16,
    lineHeight: 23,
    color: "rgba(255,255,255,0.76)",
    textAlign: "center",
  },
  features: {
    justifyContent: "center",
    gap: spacing.sm,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: 66,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  featureIconFrame: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "rgba(45,212,191,0.16)",
  },
  featureIcon: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.aqua,
    textAlign: "center",
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  button: {
    minHeight: MIN_TOUCH_SIZE + 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    shadowColor: "#001B44",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  pressed: {
    opacity: 0.75,
  },
  buttonLabel: {
    color: colors.brand,
    fontSize: 17,
    fontWeight: "800",
  },
  buttonArrow: {
    color: colors.brandLight,
    fontSize: 22,
    fontWeight: "700",
  },
});
