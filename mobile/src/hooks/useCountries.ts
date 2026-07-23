import {
  getAllCountries,
  getCountryById,
  normalizeSearchTerm,
  searchCountriesByName,
  type Country,
} from "@countries/shared";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const STALE_TIME_MS = 5 * 60 * 1000;

/**
 * Server state for the list screen. An empty term loads the full list;
 * otherwise it searches by name against the API (callers debounce the term).
 */
export function useCountries(searchTerm: string) {
  const term = normalizeSearchTerm(searchTerm);
  return useQuery({
    queryKey: ["countries", term],
    queryFn: ({ signal }) =>
      term ? searchCountriesByName(term, signal) : getAllCountries(signal),
    staleTime: STALE_TIME_MS,
  });
}

/** Detail data, seeded from any cached list so navigation feels instant. */
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
  });
}
