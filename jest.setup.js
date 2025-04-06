import { jest } from "@jest/globals";
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// テスト時に使用するモック等の設定
// dateUtilsモジュールをモック
jest.mock("@/lib/utils/dateUtils");

// Expoの設定をモック
jest.mock("expo-constants", () => ({
  Constants: {
    expoConfig: {
      extra: {
        supabaseUrl: "https://mock-supabase-url.com",
        supabaseAnonKey: "mock-supabase-anon-key",
      },
    },
  },
}));

// 環境変数をモック
process.env.SUPABASE_URL = "https://mock-supabase-url.com";
process.env.SUPABASE_ANON_KEY = "mock-supabase-anon-key";
process.env.NODE_ENV = "test";

// Expoモジュールをモック
jest.mock("expo-image", () => ({
  Image: "Image",
}));

jest.mock("expo-router", () => ({
  Link: "Link",
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Stack: {
    Screen: "Stack.Screen",
  },
}));

jest.mock("@expo/vector-icons", () => ({
  MaterialIcons: "MaterialIcons",
  Feather: "Feather",
  Ionicons: "Ionicons",
}));

// Expoの基本モジュール
jest.mock("expo", () => ({
  Expo: {
    modules: {},
  },
}));

// expo-assetモジュール
jest.mock("expo-asset", () => ({
  Asset: {
    fromModule: jest.fn().mockReturnValue({ uri: "mock-asset-uri" }),
  },
}));
