const webpack = require("webpack");

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@privy-io/react-auth", "styled-components"],
  compiler: {
    styledComponents: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "why-is-node-running": false,
      "@farcaster/mini-app-solana": false,
    };

    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/test\/(helper|context\.test)$/,
        contextRegExp: /thread-stream$/,
      }),
    );

    return config;
  },
};
