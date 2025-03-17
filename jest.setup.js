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
