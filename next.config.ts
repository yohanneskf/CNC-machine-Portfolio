/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // If you're using local images
    domains: ["localhost"],
  },
  // Optional: Add if you have TypeScript issues
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
