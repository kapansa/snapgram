/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.r2.dev" }],
  },
};

export default nextConfig;
