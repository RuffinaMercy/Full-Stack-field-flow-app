// frontend/eslint.config.js
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Apply React rules specifically to TSX files
    files: ["**/*.tsx"],
    ...pluginReactConfig,
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
    rules: {
      // You can add or override rules here.
      // For example, disable the rule that requires React to be in scope.
      "react/react-in-jsx-scope": "off",
    },
  },
];