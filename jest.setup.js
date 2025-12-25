// Jest setup file to mock Vite-specific globals

// Mock import.meta.env for Vite
global.import = global.import || {};
global.import.meta = global.import.meta || {};
global.import.meta.env = {
  DEV: false,
  PROD: true,
};
