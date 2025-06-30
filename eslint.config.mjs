import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  ...compat.extends("next/core-web-vitals"),
  {
    plugins: {
      "jsx-a11y": jsxA11y,
      react,
      "@typescript-eslint": typescriptEslint,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest", // Используем "latest" вместо конкретной версии
      sourceType: "module", // Указываем, что это модули
    },
    settings: {
      react: {
        version: "detect", // Автоматическое определение версии React
      },
    },
    rules: {
      "react/prop-types": "off", // Отключаем, если используем TypeScript
      "@typescript-eslint/no-unused-vars": ["warn"], // Пример правила
    },
  },
];

export default config;