import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default [
  // Global ignores
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  // Recommended configs
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  // React specific configuration
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react: pluginReact,
    },
    rules: {
      // Include recommended React rules
      ...pluginReact.configs.recommended.rules,
      // Disable rules that are not compatible with React 17+ JSX transform or are not needed with TypeScript
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];