import {
  filterCountriesByName,
  filterCountriesByRegion,
  getAllCountries,
  getCountryById,
  type Country,
  type SupportedLanguage,
} from "@countries/shared";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

const STALE_TIME_MS = 5 * 60 * 1000;

interface CountriesOptions {
  searchTerm: string;
  language: SupportedLanguage;
  region: string | null;
  /** Ids to restrict the list to, or null to show every country. */
  favoriteIds: string[] | null;
}

/**
 * Server state for the list screen: the full list is fetched once and cached,
 * then narrowed in memory (region → favourites → name). Filtering client-side
 * keeps every keystroke instant and spends no API quota.
 */
export function useCountries({ searchTerm, language, region, favoriteIds }: CountriesOptions) {
  const query = useQuery({
    queryKey: ["countries"],
    queryFn: ({ signal }) => getAllCountries(signal),
    staleTime: STALE_TIME_MS,
  });

  const countries = useMemo(() => {
    if (!query.data) return undefined;
    let result = filterCountriesByRegion(query.data, region);
    if (favoriteIds) {
      const lookup = new Set(favoriteIds);
      result = result.filter((country) => lookup.has(country.id));
    }
    return filterCountriesByName(result, searchTerm, language);
  }, [query.data, region, favoriteIds, searchTerm, language]);

  return { ...query, data: countries };
}

/**
 * Resolves alpha-3 codes (e.g. bordering countries) to country objects, so
 * they can be shown by name. Shares the list query, so arriving from the list
 * costs nothing; opening a detail directly loads it once and warms the cache.
 */
export function useCountryLookup(): (id: string) => Country | undefined {
  const { data } = useQuery({
    queryKey: ["countries"],
    queryFn: ({ signal }) => getAllCountries(signal),
    staleTime: STALE_TIME_MS,
  });

  const byId = useMemo(
    () => new Map((data ?? []).map((country) => [country.id, country])),
    [data],
  );

  return (id: string) => byId.get(id);
}

/**
 * Detail data, seeded from the cached list so navigation renders instantly.
 * The seed only carries the list fields, so it is marked as stale on arrival
 * (`initialDataUpdatedAt: 0`) and the richer detail request runs right away.
 */
export function useCountry(id: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["country", id],
    queryFn: ({ signal }) => getCountryById(id, signal),
    staleTime: STALE_TIME_MS,
    initialData: () =>
      queryClient
        .getQueriesData<Country[]>({ queryKey: ["countries"] })
        .flatMap(([, countries]) => countries ?? [])
        .find((country) => country.id === id),
    initialDataUpdatedAt: 0,
  });
}
