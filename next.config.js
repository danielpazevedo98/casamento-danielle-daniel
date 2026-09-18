/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "phlmgwfymzdhlxdrjeuh.supabase.co" }],
  },
  async headers() {
    // O admin nao deve aparecer no Google.
    return [{ source: "/admin", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

module.exports = nextConfig;
