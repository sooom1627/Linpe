import { jest } from "@jest/globals";
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Bottom Sheetの最小限のモック
jest.mock("@gorhom/bottom-sheet", () => {
  return {
    BottomSheetModal: jest.fn(({ children }) => children),
    BottomSheetBackdrop: jest.fn(() => null),
    BottomSheetView: jest.fn(({ children }) => children),
  };
});
