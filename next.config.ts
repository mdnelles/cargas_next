import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
   output: "standalone",
   images: {
      domains: ["localhost", "cargas.io"],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
   },
   assetPrefix:
      process.env.NODE_ENV === "production" ? "https://cargas.io" : "",
};

export default nextConfig;
