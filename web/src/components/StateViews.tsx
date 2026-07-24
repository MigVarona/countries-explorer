/** Shared UI states for the list and detail pages: loading, error and empty. */

export function LoadingView({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-slate-500" role="status">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorView({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center" role="alert">
      <p className="text-slate-700">
        Something went wrong while loading the data. Please check your connection and try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-slate-800 px-5 py-2.5 text-white transition hover:bg-slate-700"
      >
        Retry
      </button>
    </div>
  );
}

export function EmptyView({
  searchTerm,
  onClear,
}: {
  searchTerm: string;
  onClear: () => void;
}) {
  return (
    <section
      className="mx-auto my-4 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-blue-950/5"
      aria-labelledby="empty-state-title"
    >
      <div className="flex flex-col items-center px-6 py-12 text-center sm:px-12">
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">
          <span className="absolute h-16 w-16 rounded-full border border-blue-100" />
          <svg
            viewBox="0 0 48 48"
            className="relative h-12 w-12 text-blue-950"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="21" cy="21" r="11" stroke="currentColor" strokeWidth="3" />
            <path
              d="m29 29 8 8"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M16.5 18.5c2-2.3 5.4-3 8.1-1.5"
              stroke="#14b8a6"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute right-1 bottom-2 flex h-7 w-7 items-center justify-center rounded-full bg-teal-400 text-lg font-bold text-blue-950 shadow-sm">
            ?
          </span>
        </div>

        <p className="mb-2 text-xs font-bold tracking-[0.18em] text-teal-600 uppercase">
          No matches
        </p>
        <h2 id="empty-state-title" className="text-2xl font-bold tracking-tight text-blue-950">
          No countries found
        </h2>
        <p className="mt-3 max-w-md leading-7 text-slate-600">
          We couldn&apos;t find a country matching{" "}
          <strong className="break-all font-semibold text-slate-800">“{searchTerm}”</strong>. Check
          the spelling or try a shorter name.
        </p>

        <button
          type="button"
          onClick={onClear}
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white shadow-md shadow-blue-950/15 transition hover:-translate-y-0.5 hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-950"
        >
          Clear search
        </button>
      </div>
      <div className="h-1.5 bg-linear-to-r from-blue-950 via-teal-400 to-blue-600" />
    </section>
  );
}
