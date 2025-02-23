// eslint.config.js
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier";

export default [
  js.configs.recommended,
  ts.configs.recommended,
  react.configs.recommended,
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": ts,
      react,
      prettier,
    },
    rules: {
      ...prettier.configs.recommended.rules, // Ensures Prettier rules are applied
    },
    settings: {
      "import/resolver": {
        typescript: {},
      },
    },
  },
];
