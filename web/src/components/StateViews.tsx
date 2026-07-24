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

export function EmptyView({ searchTerm }: { searchTerm: string }) {
  return (
    <div className="py-16 text-center text-slate-500">
      <p>
        No results found{searchTerm ? ` for “${searchTerm}”` : ""}.
      </p>
    </div>
  );
}
