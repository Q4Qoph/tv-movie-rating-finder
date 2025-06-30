import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'imdb-api.com',
      'tv-api.com',
      'm.media-amazon.com',
      'i.imgur.com',
      'via.placeholder.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  experimental: {
    optimizePackageImports:['lucide-react', 'lucide-svelte'],
  }

};

export default nextConfig;
