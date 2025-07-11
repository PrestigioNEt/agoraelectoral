module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es2021: true,
    node: true,
    // jest: true, // Uncomment if using Jest for tests
  },
  extends: [
    'eslint:recommended',
    // 'plugin:node/recommended', // Consider adding for Node.js best practices
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    // Add any project-specific rules here
    // Example:
    // 'no-console': 'warn',
  },
};
