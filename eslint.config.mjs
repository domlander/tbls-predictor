import { defineConfig, globalIgnores } from "eslint/config";
import nextTs from "eslint-config-next/typescript";
import globals from "globals";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  ...nextTs,
  prettier,
  globalIgnores([".next/**", "./tsconfig.json", "next-env.d.ts"]),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
      ecmaVersion: 12,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "none",
        },
      ],
      "arrow-body-style": "off",
      "import/extensions": "off",
      "import/no-unresolved": "off",
      "import/prefer-default-export": "off",
      "no-lonely-if": "off",
      "no-nested-ternary": "off",
      "no-plusplus": "off",
      "no-unused-vars": "off",
      "no-use-before-define": "off",
      radix: "off",
    },
  },
]);
