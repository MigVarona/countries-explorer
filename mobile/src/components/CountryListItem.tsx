import { formatPopulation, getCountryName, type Country } from "@countries/shared";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { FavoriteButton } from "./FavoriteButton";
import { colors, MIN_TOUCH_SIZE, spacing } from "../theme";

interface Props {
  country: Country;
  onPress: (country: Country) => void;
}

function CountryListItemBase({ country, onPress }: Props) {
  const { t, i18n } = useTranslation();
  const displayName = getCountryName(country, i18n.language.startsWith("es") ? "es" : "en");

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={displayName}
      accessibilityHint={t("detail.title")}
      onPress={() => onPress(country)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <Image
        source={{ uri: country.flagPng }}
        style={styles.flag}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {displayName}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {t(`regions.${country.region}`, { defaultValue: country.region })}
          {country.capital ? ` · ${country.capital}` : ""}
        </Text>
        <Text style={styles.population} numberOfLines={1}>
          {formatPopulation(country.population, i18n.language)}
        </Text>
      </View>
      <FavoriteButton countryId={country.id} />
    </Pressable>
  );
}

/** Memoized so the list only re-renders rows whose data actually changed. */
export const CountryListItem = memo(CountryListItemBase);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: MIN_TOUCH_SIZE + spacing.lg,
    paddingLeft: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    shadowColor: "#12335B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: {
    opacity: 0.6,
  },
  flag: {
    width: 48,
    height: 32,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  meta: {
    fontSize: 13,
    color: colors.textMuted,
  },
  population: {
    fontSize: 12,
    color: colors.textMuted,
    fontVariant: ["tabular-nums"],
  },
});
