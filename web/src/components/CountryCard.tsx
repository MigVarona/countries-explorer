import Link from "next/link";
import { formatPopulation, type Country } from "@countries/shared";

export function CountryCard({ country }: { country: Country }) {
  return (
    <Link
      href={`/country/${country.id}`}
      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900"
    >
      {/* Plain <img>: flags come from an external CDN and next/image would need
          remote-pattern config for marginal benefit here. */}
      <img
        src={country.flagSvg || country.flagPng}
        alt={country.flagAlt || `Flag of ${country.name}`}
        loading="lazy"
        className="h-10 w-16 shrink-0 rounded object-cover ring-1 ring-slate-200"
      />
      <div className="min-w-0">
        <h2 className="truncate font-semibold text-slate-900">{country.name}</h2>
        <p className="truncate text-sm text-slate-500">
          {country.capital ?? "—"} · {country.region} · {formatPopulation(country.population)}
        </p>
      </div>
    </Link>
  );
}
