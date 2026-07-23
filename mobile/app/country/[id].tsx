import { formatPopulation } from "@countries/shared";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SvgUri } from "react-native-svg";

import { EmptyView, ErrorView, LoadingView } from "../../src/components/StateViews";
import { useCountry } from "../../src/hooks/useCountries";
import { colors, spacing } from "../../src/theme";

export default function CountryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { data: country, isPending, isError, refetch } = useCountry(id);

  // SVG flags as a bonus; fall back to the PNG if the SVG fails to load.
  const [svgFailed, setSvgFailed] = useState(false);

  const renderContent = () => {
    if (isPending) return <LoadingView />;
    if (isError) return <ErrorView onRetry={() => void refetch()} />;
    if (!country) return <EmptyView />;

    return (
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.flagContainer} accessible accessibilityLabel={country.flagAlt}>
          {svgFailed ? (
            <Image source={{ uri: country.flagPng }} style={styles.flag} resizeMode="cover" />
          ) : (
            <SvgUri
              uri={country.flagSvg}
              width="100%"
              height="100%"
              onError={() => setSvgFailed(true)}
            />
          )}
        </View>

        <Text style={styles.name}>{country.name}</Text>

        <View style={styles.card}>
          <DetailRow label={t("detail.officialName")} value={country.officialName} />
          <DetailRow label={t("detail.capital")} value={country.capital ?? t("detail.noCapital")} />
          <DetailRow
            label={t("detail.population")}
            value={formatPopulation(country.population, i18n.language)}
          />
          <DetailRow label={t("detail.region")} value={country.region} />
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: t("detail.title") }} />
      {renderContent()}
    </View>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <View style={styles.row} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  flagContainer: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    aspectRatio: 3 / 2,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  flag: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  card: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    minHeight: 48,
  },
  rowLabel: {
    fontSize: 14,
    color: colors.textMuted,
  },
  rowValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    textAlign: "right",
  },
});
