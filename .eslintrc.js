// TypeScriptの型補完を有効にするため、ESLint設定の型定義 (Linter.Config) を明示しています。
/** @type {import("eslint").Linter.Config} */
const config = {
  // TypeScriptコードを解析するためのパーサを指定。JavaScriptだけでなくTypeScript構文を理解することが可能になります。
  parser: "@typescript-eslint/parser",
  parserOptions: {
    // tsconfig.jsonを指定し、TypeScriptのプロジェクト構成と型情報を取得します。型チェックや高度な静的解析が可能になります。
    project: "./tsconfig.json",
    // 最新のECMAScript機能（ESNext）を使用します。
    ecmaVersion: "latest",
    // moduleを指定することで、import/export構文を使用可能にします。
    sourceType: "module",
    ecmaFeatures: {
      // jsx: true: JSX構文をサポートします（Reactコードの解析に必要）。
      jsx: true,
    },
  },
  // @typescript-eslint: TypeScript特有の静的解析ルールを提供。
  // react: React向けの解析ルールを提供。
  // react-native: React Native向けのルールを提供。
  plugins: ["@typescript-eslint", "react", "react-native"],
  extends: [
    // Expoプロジェクト向けの推奨ESLint設定。
    "expo",
    // 基本的なESLint推奨ルールセット。
    "eslint:recommended",
    // TypeScript向けの推奨ルールセット。
    "plugin:@typescript-eslint/recommended",
    // React向けの推奨ルールセット。
    "plugin:react/recommended",
    // React Native特有のルールセット（例: プラットフォーム依存のコードチェック）。
    "plugin:react-native/all",
  ],
  // プロジェクトにインストールされたReactのバージョンに基づき、最適なルールを適用します。
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // off: React 17以降ではJSXで明示的にimport Reactが不要になったため、このルールを無効化。
    "react/react-in-jsx-scope": "off",
    // 未使用の変数を警告しますが、_で始まる引数は無視します（例: (_arg)）。
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    // off: 配列型の指定方法（例: Array<T> vs T[]）に関するルールを無効化。
    "@typescript-eslint/array-type": "off",
    // off: typeとinterfaceの使用を強制しません。
    "@typescript-eslint/consistent-type-definitions": "off",
    // 型のインポートをimport typeに統一し、インライン形式を推奨。
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    // off: 非同期関数でawaitを必須とするルールを無効化。
    "@typescript-eslint/require-await": "off",
    // Promiseの誤用を防止しますが、特定の属性チェックは無効化。
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: { attributes: false },
      },
    ],
    // off: require構文の使用を許可。
    "@typescript-eslint/no-var-requires": "off",
  },
  // ESLintの解析対象外とするパスやファイルを指定します
  ignorePatterns: [
    ".eslintrc.cjs",
    "babel.config.js",
    "metro.config.js",
    "dist",
    "build",
    "node_modules",
    "app-example",
    "app-example/**/*",
    "*.config.js",
    "*.config.cjs",
    "*.config.ts",
    "*.d.ts",
    "coverage",
    "jest.config.js",
  ],
};

module.exports = config;