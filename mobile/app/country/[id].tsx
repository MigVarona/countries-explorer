import {
  formatPopulation,
  getCountryName,
  getCountryOfficialName,
  type SupportedLanguage,
} from "@countries/shared";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FavoriteButton } from "../../src/components/FavoriteButton";
import { FlagImage } from "../../src/components/FlagImage";
import { SkeletonBlock } from "../../src/components/Skeleton";
import { ErrorView } from "../../src/components/StateViews";
import { useCountryLookup, useCountry } from "../../src/hooks/useCountries";
import { colors, MIN_TOUCH_SIZE, spacing } from "../../src/theme";

/** Above this width the flag and the data sit side by side. */
const WIDE_LAYOUT_BREAKPOINT = 700;

export default function CountryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const language: SupportedLanguage = i18n.language.startsWith("es") ? "es" : "en";
  const { data: country, isPending, isError, refetch } = useCountry(id);
  const lookupCountry = useCountryLookup();

  const isWide = width >= WIDE_LAYOUT_BREAKPOINT;
  const numberFormat = new Intl.NumberFormat(i18n.language);

  const renderContent = () => {
    if (isPending) return <DetailSkeleton />;
    if (isError || !country) return <ErrorView onRetry={() => void refetch()} />;

    const flag = (
      <View style={styles.flagCard} accessible accessibilityLabel={country.flagAlt}>
        <FlagImage svgUri={country.flagSvg} pngUri={country.flagPng} />
      </View>
    );

    const details = (
      <View style={styles.details}>
        <View style={[styles.heading, isWide && styles.headingWide]}>
          <Text style={[styles.name, isWide && styles.nameWide]}>
            {getCountryName(country, language)}
          </Text>
          <Text style={[styles.officialName, isWide && styles.officialNameWide]}>
            {getCountryOfficialName(country, language)}
          </Text>
        </View>

        <View style={styles.stats}>
          <StatTile
            label={t("detail.capital")}
            value={country.capital ?? t("detail.noCapital")}
          />
          <StatTile
            label={t("detail.population")}
            value={formatPopulation(country.population, i18n.language)}
          />
          <StatTile
            label={t("detail.region")}
            value={t(`regions.${country.region}`, { defaultValue: country.region })}
          />
          {country.subregion ? (
            <StatTile
              label={t("detail.subregion")}
              value={t(`subregions.${country.subregion}`, { defaultValue: country.subregion })}
            />
          ) : null}
          {country.areaKm2 ? (
            <StatTile
              label={t("detail.area")}
              value={`${numberFormat.format(country.areaKm2)} km²`}
            />
          ) : null}
          <StatTile label={t("detail.code")} value={country.id} />
        </View>

        {country.languages.length > 0 && (
          <Section title={t("detail.languages")}>
            <View style={styles.tags}>
              {country.languages.map((item) => (
                <Tag
                  key={item.name}
                  label={
                    item.nativeName && item.nativeName !== item.name
                      ? `${item.name} · ${item.nativeName}`
                      : item.name
                  }
                />
              ))}
            </View>
          </Section>
        )}

        {country.currencies.length > 0 && (
          <Section title={t("detail.currencies")}>
            <View style={styles.tags}>
              {country.currencies.map((item) => (
                <Tag
                  key={item.code}
                  label={`${item.name} (${item.code})${item.symbol ? ` ${item.symbol}` : ""}`}
                />
              ))}
            </View>
          </Section>
        )}

        {(country.callingCodes.length > 0 ||
          country.topLevelDomains.length > 0 ||
          country.timezones.length > 0 ||
          country.drivingSide) && (
          <Section title={t("detail.practical")}>
            <View style={styles.factList}>
              {country.callingCodes.length > 0 && (
                <Fact label={t("detail.callingCode")} value={country.callingCodes.join(", ")} />
              )}
              {country.topLevelDomains.length > 0 && (
                <Fact label={t("detail.tld")} value={country.topLevelDomains.join(", ")} />
              )}
              {country.timezones.length > 0 && (
                <Fact label={t("detail.timezones")} value={country.timezones.join(", ")} />
              )}
              {country.drivingSide && (
                <Fact
                  label={t("detail.drivingSide")}
                  value={t(`drivingSide.${country.drivingSide}`, {
                    defaultValue: country.drivingSide,
                  })}
                />
              )}
              {country.landlocked !== null && (
                <Fact
                  label={t("detail.coastline")}
                  value={t(country.landlocked ? "detail.landlocked" : "detail.hasCoastline")}
                />
              )}
            </View>
          </Section>
        )}

        {country.borders.length > 0 && (
          <Section title={t("detail.borders")}>
            <View style={styles.tags}>
              {country.borders.map((code) => {
                const neighbour = lookupCountry(code);
                return (
                  <Tag
                    key={code}
                    label={neighbour ? getCountryName(neighbour, language) : code}
                    onPress={() => router.push(`/country/${code}`)}
                  />
                );
              })}
            </View>
          </Section>
        )}
      </View>
    );

    return (
      <ScrollView
        contentContainerStyle={[
          styles.content,
          isWide && styles.contentWide,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
      >
        <View style={isWide ? styles.columnHalf : undefined}>{flag}</View>
        <View style={isWide ? styles.columnHalf : undefined}>{details}</View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          title: t("detail.title"),
          headerStyle: { backgroundColor: colors.brand },
          headerTitleStyle: { color: "#FFFFFF", fontWeight: "700" },
          headerTintColor: "#FFFFFF",
          headerShadowVisible: false,
          headerRight: () => <FavoriteButton countryId={id} size="large" onBrand />,
        }}
      />
      <View style={styles.brandBackdrop}>
        <View style={[styles.orbit, styles.orbitLarge]} />
        <View style={[styles.orbit, styles.orbitSmall]} />
      </View>
      {renderContent()}
    </View>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.tile} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={styles.tileValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

/** A pill. With `onPress` it navigates (used for bordering countries). */
function Tag({ label, onPress }: { label: string; onPress?: () => void }) {
  if (!onPress) {
    return (
      <View style={styles.tag}>
        <Text style={styles.tagLabel}>{label}</Text>
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.tag, styles.tagPressable, pressed && styles.tagPressed]}
    >
      <Text style={[styles.tagLabel, styles.tagLabelPressable]}>{label} →</Text>
    </Pressable>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

function DetailSkeleton() {
  return (
    <View style={styles.content} accessibilityRole="progressbar">
      <SkeletonBlock style={styles.flagCard} />
      <SkeletonBlock style={styles.skeletonTitle} />
      <View style={styles.stats}>
        {Array.from({ length: 4 }, (_, index) => (
          <SkeletonBlock key={index} style={styles.skeletonTile} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  brandBackdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    height: 145,
    overflow: "hidden",
    backgroundColor: colors.brand,
  },
  orbit: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
  },
  orbitLarge: {
    width: 210,
    height: 210,
    top: -125,
    right: -45,
  },
  orbitSmall: {
    width: 92,
    height: 92,
    top: 32,
    right: 38,
    backgroundColor: "rgba(45,212,191,0.08)",
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  contentWide: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  columnHalf: {
    flex: 1,
  },
  flagCard: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    aspectRatio: 3 / 2,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.card,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    shadowColor: "#001B44",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  flagImage: {
    width: "100%",
    height: "100%",
  },
  details: {
    gap: spacing.lg,
  },
  heading: {
    gap: spacing.xs,
  },
  headingWide: {
    alignItems: "flex-start",
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  nameWide: {
    textAlign: "left",
  },
  officialName: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: "center",
  },
  officialNameWide: {
    textAlign: "left",
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    justifyContent: "center",
  },
  tile: {
    flexGrow: 1,
    flexBasis: 150,
    maxWidth: 260,
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  tileLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  tileValue: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.text,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: colors.textMuted,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  tag: {
    justifyContent: "center",
    minHeight: 34,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 17,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  tagPressable: {
    minHeight: MIN_TOUCH_SIZE,
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  tagPressed: {
    opacity: 0.6,
  },
  tagLabel: {
    fontSize: 14,
    color: colors.text,
  },
  tagLabelPressable: {
    color: colors.accent,
    fontWeight: "600",
  },
  factList: {
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  fact: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.lg,
    minHeight: 46,
    paddingVertical: spacing.sm,
  },
  factLabel: {
    fontSize: 14,
    color: colors.textMuted,
  },
  factValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    textAlign: "right",
  },
  skeletonTitle: {
    height: 28,
    width: "60%",
    alignSelf: "center",
  },
  skeletonTile: {
    height: 80,
    flexGrow: 1,
    flexBasis: 150,
    maxWidth: 260,
    borderRadius: 12,
  },
});
