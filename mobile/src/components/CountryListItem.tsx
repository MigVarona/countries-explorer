import { formatPopulation, type Country } from "@countries/shared";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, MIN_TOUCH_SIZE, spacing } from "../theme";

interface Props {
  country: Country;
  onPress: (country: Country) => void;
}

function CountryListItemBase({ country, onPress }: Props) {
  const { t, i18n } = useTranslation();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={country.name}
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
          {country.name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {country.region}
          {country.capital ? ` · ${country.capital}` : ""}
        </Text>
      </View>
      <Text style={styles.population}>
        {formatPopulation(country.population, i18n.language)}
      </Text>
    </Pressable>
  );
}

/** Memoized so FlatList re-renders only the rows whose data changed. */
export const CountryListItem = memo(CountryListItemBase);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: MIN_TOUCH_SIZE + spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
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
    gap: spacing.xs,
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
    fontSize: 13,
    color: colors.textMuted,
    fontVariant: ["tabular-nums"],
  },
});
