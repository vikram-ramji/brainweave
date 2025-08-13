import type { NextConfig } from "next";

type RuleSetRuleLike = {
  test?: RegExp;
  issuer?: unknown;
  resourceQuery?: unknown;
  exclude?: unknown;
  [key: string]: unknown;
};

const nextConfig: NextConfig = {
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find(
      (rule: unknown): rule is RuleSetRuleLike =>
        typeof rule === "object" &&
        rule !== null &&
        "test" in (rule as Record<string, unknown>) &&
        (rule as RuleSetRuleLike).test instanceof RegExp &&
        (rule as RuleSetRuleLike).test!.test(".svg"),
    );

    if (!fileLoaderRule) {
      // If we can't find the rule, return the config unchanged.
      return config;
    }

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        // exclude if *.svg?url
        resourceQuery: {
          not: [
            ...((
              fileLoaderRule.resourceQuery as unknown as {
                not?: (string | RegExp)[];
              }
            )?.not ?? []),
            /url/,
          ],
        },
        use: ["@svgr/webpack"],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              icon: true,
            },
          },
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
