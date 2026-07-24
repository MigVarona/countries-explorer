import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Countries Explorer",
  description: "Browse and search countries powered by the REST Countries API.",
  // Same app icon as the mobile app, so both platforms share an identity.
  icons: { icon: "/icon.png", apple: "/icon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <header className="border-b border-blue-900 bg-blue-950 text-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
            <Link href="/" className="flex items-center gap-3 text-xl font-bold">
              <Image
                src="/icon.png"
                alt=""
                width={36}
                height={36}
                priority
                className="rounded-xl"
              />
              <span>Countries Explorer</span>
            </Link>
            <span className="hidden text-sm text-blue-200 sm:inline">REST Countries companion</span>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
