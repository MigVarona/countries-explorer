import { useMemo } from "react";
import { filterCountriesByName, getAllCountries, getCountryById } from "@countries/shared";
import { useAsyncData } from "./useAsyncData";

/**
 * Countries for the list page: the full list is fetched once, then filtered
 * in memory by the (debounced) search term — the v5 API cannot search
 * translated names server-side and ~250 items filter instantly.
 */
export function useCountries(searchTerm: string) {
  const { state, retry } = useAsyncData((signal) => getAllCountries(signal), []);

  const filteredState = useMemo(() => {
    if (state.status !== "success") return state;
    return { ...state, data: filterCountriesByName(state.data, searchTerm) };
  }, [state, searchTerm]);

  return { state: filteredState, retry };
}

/** Single country for the detail page, fetched by its cca3 code. */
export function useCountry(id: string) {
  return useAsyncData((signal) => getCountryById(id, signal), [id]);
}
