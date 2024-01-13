module.exports = {
  testMatch: ['<rootDir>/src/**/(*.)(spec|test).ts?(x)'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: ['<rootDir>/src/**/*.*'],
  coverageThreshold: {
    global: {
      branches: 45,
      functions: 35,
      lines: 35,
      statements: 35,
    },
  },
};
