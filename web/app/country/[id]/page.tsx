"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { formatPopulation } from "@countries/shared";
import { ErrorView, LoadingView } from "@/components/StateViews";
import { useCountry } from "@/hooks/useCountries";

export default function CountryDetailPage() {
  const params = useParams<{ id: string }>();
  const { state, retry } = useCountry(params.id);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/" className="self-start text-slate-600 transition hover:text-slate-900">
        ← Back to list
      </Link>

      {state.status === "loading" && <LoadingView label="Loading country…" />}
      {state.status === "error" && <ErrorView onRetry={retry} />}
      {state.status === "success" && (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <img
            src={state.data.flagSvg || state.data.flagPng}
            alt={state.data.flagAlt || `Flag of ${state.data.name}`}
            className="h-48 w-full object-cover sm:h-64"
          />
          <div className="flex flex-col gap-4 p-6">
            <div>
              <h1 className="text-2xl font-bold">{state.data.name}</h1>
              <p className="text-slate-500">{state.data.officialName}</p>
            </div>
            {/* The companion stays on the basics the brief asks for; the richer
                view (languages, currencies, borders…) lives in the mobile app. */}
            <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
              <Fact label="Capital" value={state.data.capital ?? "—"} />
              <Fact label="Region" value={state.data.region} />
              <Fact label="Population" value={formatPopulation(state.data.population)} />
            </dl>
          </div>
        </article>
      )}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
