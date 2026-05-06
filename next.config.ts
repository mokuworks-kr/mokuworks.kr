import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local SVGs in /public are trusted; CSP restricts execution.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
