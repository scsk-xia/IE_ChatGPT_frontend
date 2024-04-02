const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

/** @type {import('@jest/types').Config.InitialOptions} */
const customJestConfig = {
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.(ts|tsx)"],
  coverageThreshold: {
    global: {
      branches: 72,
      functions: 60,
      lines: 85,
      statements: 85,
    },
  },
  moduleNameMapper: {
    "^uuid$": "uuid", //https://qiita.com/Sawawada/items/23cb60ee2f3043fbe936
    "@/(.*)": ["<rootDir>/src/$1"],
  },
  setupFilesAfterEnv: ["./jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
const jestConfig = async () => {
  const nextJestConfig = await createJestConfig(customJestConfig)();
  return {
    ...nextJestConfig,
    moduleNameMapper: {
      // Workaround to put our SVG stub first
      "\\.svg$": "<rootDir>/__mocks__/svg.js", //https://react-svgr.com/docs/jest/
      ...nextJestConfig.moduleNameMapper,
    },
  };
};

module.exports = jestConfig;
