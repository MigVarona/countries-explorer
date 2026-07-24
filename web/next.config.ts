import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* @countries/shared ships raw TypeScript, so Next must transpile it. */
  transpilePackages: ["@countries/shared"],
};

export default nextConfig;
