import "dotenv/config";

import { existsSync } from "fs";
import { config } from "dotenv";

// 環境変数を読み込む関数
function loadEnv() {
  // EASビルド環境かどうかを確認
  const isEas = process.env.EAS_BUILD === "true";

  // 現在の環境を取得
  const environment = process.env.APP_ENV || "development";
  const envFile = `.env.${environment}`;

  // 環境変数ファイルが存在する場合は読み込む
  if (existsSync(envFile)) {
    config({ path: envFile });
    console.log(`Loaded environment variables from ${envFile}`);
  } else {
    // デフォルトの.envファイルを読み込む
    config();
    console.log("Loaded environment variables from .env");
  }
}

// 環境変数を読み込む
loadEnv();

export default ({ config }) => {
  return {
    ...config,
    ios: {
      bundleIdentifier: "com.linpe.app",
    },
    android: {
      package: "com.linpe.app",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    extra: {
      ...config.extra,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      appEnv: process.env.APP_ENV || "development",
    },
  };
};
