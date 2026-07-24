import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View, type ViewStyle } from "react-native";

import { colors, spacing } from "../theme";

/** A pulsing placeholder block used while content loads. */
export function SkeletonBlock({ style }: { style?: ViewStyle }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return <Animated.View style={[styles.block, style, { opacity }]} />;
}

/** Placeholder rows shown instead of a spinner while the list loads. */
export function CountryListSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <View style={styles.list} accessibilityRole="progressbar">
      {Array.from({ length: rows }, (_, index) => (
        <View key={index} style={styles.row}>
          <SkeletonBlock style={styles.flag} />
          <View style={styles.text}>
            <SkeletonBlock style={styles.line} />
            <SkeletonBlock style={styles.lineShort} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.skeleton,
    borderRadius: 6,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  flag: {
    width: 48,
    height: 32,
  },
  text: {
    flex: 1,
    gap: spacing.sm,
  },
  line: {
    height: 12,
    width: "60%",
  },
  lineShort: {
    height: 10,
    width: "40%",
  },
});
