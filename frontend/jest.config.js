module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!axios)/'],
  moduleNameMapper: {
    axios: 'axios/dist/node/axios.cjs',
  },
};
