import type { Country } from "@countries/shared";
import { Stack, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { CountryListItem } from "../src/components/CountryListItem";
import { LanguageToggle } from "../src/components/LanguageToggle";
import { SearchBar } from "../src/components/SearchBar";
import { EmptyView, ErrorView, LoadingView } from "../src/components/StateViews";
import { useCountries } from "../src/hooks/useCountries";
import { useDebouncedValue } from "../src/hooks/useDebouncedValue";
import { colors, spacing } from "../src/theme";

/** Rows rendered initially; more are appended as the user scrolls. */
const PAGE_SIZE = 30;

export default function CountryListScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedTerm = useDebouncedValue(searchTerm);
  const { data: countries, isPending, isError, refetch } = useCountries(debouncedTerm);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleCountries = useMemo(
    () => (countries ?? []).slice(0, visibleCount),
    [countries, visibleCount],
  );

  const handleSearchChange = useCallback((text: string) => {
    setSearchTerm(text);
    setVisibleCount(PAGE_SIZE);
  }, []);

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

  const renderContent = () => {
    if (isPending) return <LoadingView />;
    if (isError) return <ErrorView onRetry={() => void refetch()} />;
    if (!countries || countries.length === 0) return <EmptyView />;

    return (
      <FlatList
        data={visibleCountries}
        keyExtractor={(country) => country.id}
        renderItem={({ item }) => (
          <CountryListItem country={item} onPress={handlePressCountry} />
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        initialNumToRender={15}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <Text style={styles.resultCount} accessibilityLiveRegion="polite">
            {t("list.results", { count: countries.length })}
          </Text>
        }
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          title: t("list.title"),
          headerRight: () => <LanguageToggle />,
        }}
      />
      <SearchBar value={searchTerm} onChangeText={handleSearchChange} />
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  resultCount: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    fontSize: 13,
    color: colors.textMuted,
  },
});
