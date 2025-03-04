export const preset = 'react-native';
export const testEnvironment = 'jsdom';
export const transform = {
  '^.+\\.jsx?$': 'babel-jest',
  '^.+\\.tsx?$': 'babel-jest',
};
export const moduleFileExtensions = ['js', 'jsx', 'ts', 'tsx', 'json', 'node'];
export const testPathIgnorePatterns = ['/node_modules/', '/dist/'];
export const setupFilesAfterEnv = ['<rootDir>/src/setupTests.js'];
