import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text } from "react-native";

import { useFavorites } from "../context/FavoritesContext";
import { colors, MIN_TOUCH_SIZE } from "../theme";

interface Props {
  countryId: string;
  /** Larger star for the detail header. */
  size?: "small" | "large";
  /** High-contrast inactive state for use on the brand header. */
  onBrand?: boolean;
}

export function FavoriteButton({ countryId, size = "small", onBrand = false }: Props) {
  const { t } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(countryId);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={t(active ? "favorites.remove" : "favorites.add")}
      hitSlop={8}
      onPress={() => toggleFavorite(countryId)}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text
        style={[
          styles.star,
          size === "large" && styles.starLarge,
          onBrand && styles.onBrand,
          active && styles.active,
        ]}
      >
        {active ? "★" : "☆"}
      </Text>
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
  star: {
    fontSize: 20,
    color: colors.textMuted,
  },
  starLarge: {
    fontSize: 26,
  },
  onBrand: {
    color: "#FFFFFF",
  },
  active: {
    color: colors.star,
  },
});
