"use client";

export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search countries by name…"
      aria-label="Search countries by name"
      className="w-full rounded-xl border border-white/70 bg-white px-4 py-3 text-slate-900 shadow-lg shadow-blue-950/20 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:ring-4 focus:ring-teal-300/20"
    />
  );
}
