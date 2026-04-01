/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: [
      "puppeteer-core",
      "@sparticuz/chromium-min",
      "firebase",
      "@firebase/app",
      "@firebase/storage",
    ],
  },
  images: {
    remotePatterns: [
      {
        hostname: "*"
      },
      {
        hostname: 'avatars.githubusercontent.com',
      }
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.map$/,
      use: 'raw-loader',
      type: 'asset/resource'
    });
    return config;
  }
};

export default nextConfig;
