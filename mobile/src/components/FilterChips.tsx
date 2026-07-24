import { REGIONS } from "@countries/shared";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, MIN_TOUCH_SIZE, spacing } from "../theme";

interface Props {
  region: string | null;
  onSelectRegion: (region: string | null) => void;
  favoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
}

/** Horizontal filter bar: favourites toggle plus one chip per region. */
export function FilterChips({
  region,
  onSelectRegion,
  favoritesOnly,
  onToggleFavoritesOnly,
}: Props) {
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      // Without this the bar stretches to fill the column and drags the chips with it.
      style={styles.bar}
      contentContainerStyle={styles.content}
    >
      <Chip
        label={`★ ${t("filters.favorites")}`}
        selected={favoritesOnly}
        onPress={onToggleFavoritesOnly}
        tone="favorite"
      />
      {/* Favourites is an independent toggle, not part of the region group. */}
      <View style={styles.separator} />
      <Chip label={t("filters.all")} selected={region === null} onPress={() => onSelectRegion(null)} />
      {REGIONS.map((item) => (
        <Chip
          key={item}
          label={t(`regions.${item}`, { defaultValue: item })}
          selected={region === item}
          onPress={() => onSelectRegion(region === item ? null : item)}
        />
      ))}
    </ScrollView>
  );
}

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  tone?: "region" | "favorite";
}

function Chip({ label, selected, onPress, tone = "region" }: ChipProps) {
  const isFavorite = tone === "favorite";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && (isFavorite ? styles.chipFavoriteSelected : styles.chipSelected),
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.label,
          selected && (isFavorite ? styles.labelFavoriteSelected : styles.labelSelected),
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexGrow: 0,
    flexShrink: 0,
  },
  content: {
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  chip: {
    minHeight: MIN_TOUCH_SIZE,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  chipSelected: {
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
  },
  chipFavoriteSelected: {
    borderColor: "#FCD34D",
    backgroundColor: "#FFF8E7",
  },
  separator: {
    alignSelf: "center",
    width: StyleSheet.hairlineWidth,
    height: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    fontSize: 14,
    color: "rgba(255,255,255,0.82)",
  },
  labelSelected: {
    color: colors.accent,
    fontWeight: "600",
  },
  labelFavoriteSelected: {
    color: colors.star,
    fontWeight: "600",
  },
});
