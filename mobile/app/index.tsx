import type { Country, SupportedLanguage } from "@countries/shared";
import { Stack, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type DimensionValue,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CountryListItem } from "../src/components/CountryListItem";
import { AppIcon } from "../src/components/AppIcon";
import { FilterChips } from "../src/components/FilterChips";
import { LanguageToggle } from "../src/components/LanguageToggle";
import { SearchBar } from "../src/components/SearchBar";
import { CountryListSkeleton } from "../src/components/Skeleton";
import { EmptyView, ErrorView } from "../src/components/StateViews";
import { useFavorites } from "../src/context/FavoritesContext";
import { useCountries } from "../src/hooks/useCountries";
import { useDebouncedValue } from "../src/hooks/useDebouncedValue";
import { hasSeenWelcome } from "../src/onboarding";
import { colors, getColumnCount, spacing } from "../src/theme";

/** Rows rendered initially; more are appended as the user scrolls. */
const PAGE_SIZE = 30;

/** Exact column widths, so a lone item on the last row keeps its size. */
const COLUMN_WIDTH: Record<number, DimensionValue> = { 1: "100%", 2: "50%", 3: "33.33%" };

export default function CountryListScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { favorites } = useFavorites();

  const language: SupportedLanguage = i18n.language.startsWith("es") ? "es" : "en";
  const columns = getColumnCount(width);
  // On a short viewport (phone in landscape) the hero copy would leave no room
  // for the list, so only the search and filters stay.
  const showHeroCopy = height >= 520;

  const [searchTerm, setSearchTerm] = useState("");
  const [region, setRegion] = useState<string | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const debouncedTerm = useDebouncedValue(searchTerm);

  const {
    data: countries,
    isPending,
    isError,
    isRefetching,
    refetch,
  } = useCountries({
    searchTerm: debouncedTerm,
    language,
    region,
    favoriteIds: favoritesOnly ? favorites : null,
  });

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleCountries = useMemo(
    () => (countries ?? []).slice(0, visibleCount),
    [countries, visibleCount],
  );

  const listRef = useRef<FlatList<Country>>(null);

  // Show the intro over the list on first launch only.
  useEffect(() => {
    void hasSeenWelcome().then((seen) => {
      if (!seen) router.push("/welcome");
    });
  }, [router]);

  // Any change of filter starts a new result set: back to the top, page reset.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [debouncedTerm, region, favoritesOnly]);

  const handleEndReached = useCallback(() => {
    if (countries && visibleCount < countries.length) {
      setVisibleCount((count) => Math.min(count + PAGE_SIZE, countries.length));
    }
  }, [countries, visibleCount]);

  const handlePressCountry = useCallback(
    (country: Country) => {
      router.push(`/country/${country.id}`);
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: Country }) => (
      <View style={[styles.cell, { width: COLUMN_WIDTH[columns] }]}>
        <CountryListItem country={item} onPress={handlePressCountry} />
      </View>
    ),
    [columns, handlePressCountry],
  );

  const filters = (
    <FilterChips
      region={region}
      onSelectRegion={setRegion}
      favoritesOnly={favoritesOnly}
      onToggleFavoritesOnly={() => setFavoritesOnly((current) => !current)}
    />
  );

  const renderContent = () => {
    if (isPending) return <CountryListSkeleton />;
    if (isError) return <ErrorView onRetry={() => void refetch()} />;
    if (!countries || countries.length === 0) {
      return (
        <EmptyView
          message={favoritesOnly && favorites.length === 0 ? t("states.emptyFavorites") : undefined}
        />
      );
    }

    return (
      <FlatList
        ref={listRef}
        // FlatList needs a fresh instance when the column count changes.
        key={columns}
        numColumns={columns}
        data={visibleCountries}
        keyExtractor={(country) => country.id}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        initialNumToRender={15}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => void refetch()}
            colors={[colors.accent]}
            tintColor={colors.accent}
          />
        }
        ListHeaderComponent={
          <Text style={styles.resultCount} accessibilityLiveRegion="polite">
            {t("list.results", { count: countries.length })}
          </Text>
        }
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          title: t("list.title"),
          headerStyle: { backgroundColor: colors.brand },
          headerTitleStyle: { color: "#FFFFFF", fontWeight: "700" },
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("welcome.open")}
              onPress={() => router.push("/welcome")}
              hitSlop={8}
              style={({ pressed }) => [styles.infoButton, pressed && styles.infoButtonPressed]}
            >
              <AppIcon name="info" size={22} color="#FFFFFF" />
            </Pressable>
          ),
          headerRight: () => <LanguageToggle />,
        }}
      />
      <View style={styles.hero}>
        <View style={[styles.orbit, styles.orbitLarge]} />
        <View style={[styles.orbit, styles.orbitSmall]} />
        {showHeroCopy && (
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>COUNTRIES EXPLORER</Text>
            <Text style={styles.subtitle}>{t("list.subtitle")}</Text>
          </View>
        )}
        <SearchBar value={searchTerm} onChangeText={setSearchTerm} />
        {filters}
      </View>
      <View style={styles.results}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.brand,
  },
  hero: {
    overflow: "hidden",
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    backgroundColor: colors.brand,
  },
  orbit: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
  },
  orbitLarge: {
    width: 220,
    height: 220,
    top: -122,
    right: -54,
  },
  orbitSmall: {
    width: 92,
    height: 92,
    top: 16,
    right: 24,
    backgroundColor: "rgba(45,212,191,0.08)",
  },
  heroCopy: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  eyebrow: {
    color: colors.aqua,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.6,
  },
  subtitle: {
    maxWidth: 300,
    marginTop: spacing.xs,
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700",
  },
  results: {
    flex: 1,
    overflow: "hidden",
    marginTop: -spacing.sm,
    paddingTop: spacing.sm,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
  cell: {
    padding: spacing.xs,
  },
  resultCount: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: colors.accent,
  },
  infoButton: {
    width: 32,
    height: 32,
    marginRight: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.8)",
  },
  infoButtonPressed: {
    opacity: 0.55,
  },
});
