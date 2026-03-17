/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!**/*.spec.ts",
    "!**/__mocks__/*",
    "!**/types/*",
    "!**/*.d.ts",
    "!src/scripts/*.ts",
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ["lcov", "text"],
  preset: "ts-jest",
  injectGlobals: true,
};

export default config;
