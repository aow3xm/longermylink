import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // Đường dẫn đến ứng dụng Next.js của bạn
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Tự động clear mock trước mỗi test
  clearMocks: true,
  
  // Thu thập thông tin coverage
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  
  // Ánh xạ các đường dẫn module
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  
  // Sử dụng jsdom cho môi trường test
  testEnvironment: "jsdom",
  
  // Bỏ qua các node_modules ngoại trừ next-router-mock
  transformIgnorePatterns: [
    "/node_modules/(?!next-router-mock)/"
  ],
  
  // Thiết lập file cài đặt cho Jest sau khi môi trường đã được thiết lập
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
