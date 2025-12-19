import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow webpack config in Next.js 16 (Turbopack default)
  turbopack: {},

  webpack: (config, { isServer, webpack }) => {
    // Polyfill for Node.js globals in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        buffer: require.resolve('buffer/'),
        '@react-native-async-storage/async-storage': false,
      };

      // Define global variables properly
      config.plugins.push(
        new webpack.DefinePlugin({
          'global': 'globalThis',
        })
      );

      // Provide Buffer polyfill
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );
    }

    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
};

export default nextConfig;
