import pluginJs from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { extends: ["eslint:recommended", "plugin:react-hooks/recommended"] },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: ["react-hooks"],
    rules: {
      "react-hooks/rules-of-hooks": "error", // Checks rules of hooks
      "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
