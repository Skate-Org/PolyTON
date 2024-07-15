import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.ts$": ['ts-jest', { useESM: true }],
    "^.+\\.js$": "babel-jest", // Use babel-jest for JS files to handle ESM
  },
  transformIgnorePatterns: [
    "/node_modules/(?!@noble/ed25519)" // Allow Jest to transform @noble/ed25519
  ],
};

export default config;

