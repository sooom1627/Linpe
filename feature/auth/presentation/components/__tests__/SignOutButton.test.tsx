import { fireEvent, render } from "@testing-library/react-native";

import { SignOutButton } from "@/feature/auth/presentation/components/actions/SignOutButton";
import { createTestProps, mockAuthService } from "./mocks/componentMocks";

// LogoutIconをモック
jest.mock("@/components/icons/LogoutIcon", () => ({
  LogoutIcon: () => null,
}));

// Expoのフォントをモック
jest.mock("expo-font", () => ({
  isLoaded: jest.fn(() => true),
  loadAsync: jest.fn(),
  Font: {
    isLoaded: jest.fn(() => true),
  },
}));

// authServiceを直接モック
jest.mock("@/feature/auth/application/service/authService", () => ({
  signout: () => mockAuthService.signout(),
}));

describe("SignoutButton", () => {
  // テスト共通のデータ
  const onSignout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    // 準備
    const props = createTestProps({
      onSignout,
    });

    // 実行
    const { getByText } = render(<SignOutButton {...props} />);

    // 検証
    expect(getByText("Log out")).toBeTruthy();
  });

  it("calls signout function when pressed", async () => {
    // 準備
    const props = createTestProps({
      onSignout,
    });
    mockAuthService.signout.mockResolvedValue(undefined);

    // 実行
    const { getByText } = render(<SignOutButton {...props} />);
    fireEvent.press(getByText("Log out"));

    // 検証
    expect(mockAuthService.signout).toHaveBeenCalledTimes(1);

    // 非同期処理の完了を待つ
    await new Promise(process.nextTick);
    expect(onSignout).toHaveBeenCalledTimes(1);
  });
});
