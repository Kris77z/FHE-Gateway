/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  webpack: (config) => {
    // 忽略 pino 的可选依赖，避免构建环境缺失 'pino-pretty' 报错
    config.resolve = config.resolve || { alias: {} };
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'pino-pretty': false,
      colorette: false,
      'supports-color': false,
    };
    return config;
  },
};

module.exports = nextConfig;

