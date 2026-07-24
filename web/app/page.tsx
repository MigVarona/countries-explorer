"use client";

import { useEffect, useState } from "react";
import { CountryCard } from "@/components/CountryCard";
import { SearchBar } from "@/components/SearchBar";
import { EmptyView, ErrorView, LoadingView } from "@/components/StateViews";
import { useCountries } from "@/hooks/useCountries";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

/** Incremental rendering: show this many results at first, grow on demand. */
const PAGE_SIZE = 24;

export default function CountriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedTerm = useDebouncedValue(searchTerm);
  const { state, retry } = useCountries(debouncedTerm);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [debouncedTerm]);

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-3xl bg-blue-950 px-6 py-8 text-white shadow-sm sm:px-8">
        <p className="mb-2 text-xs font-bold tracking-[0.2em] text-teal-300 uppercase">
          Countries Explorer
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore the world</h1>
        <p className="mt-2 max-w-xl text-blue-100">
          Search countries and discover their flags, capitals, population and region.
        </p>
        <div className="mt-6">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </section>

      {state.status === "loading" && <LoadingView label="Loading countries…" />}
      {state.status === "error" && <ErrorView onRetry={retry} />}
      {state.status === "success" && state.data.length === 0 && (
        <EmptyView searchTerm={debouncedTerm} />
      )}
      {state.status === "success" && state.data.length > 0 && (
        <>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-slate-600">
              {state.data.length} {state.data.length === 1 ? "country" : "countries"}
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {state.data.slice(0, visibleCount).map((country) => (
              <li key={country.id}>
                <CountryCard country={country} />
              </li>
            ))}
          </ul>
          {visibleCount < state.data.length && (
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="mx-auto rounded-xl bg-blue-950 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-950"
            >
              Load more ({state.data.length - visibleCount} remaining)
            </button>
          )}
        </>
      )}
    </div>
  );
}
