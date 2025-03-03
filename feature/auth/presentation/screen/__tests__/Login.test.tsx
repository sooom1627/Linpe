import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { mockAuthService } from "../../components/__tests__/mocks/componentMocks";
import { Login } from "../Login";

// 認証サービスの引数の型
type LoginParams = [string, string, (loading: boolean) => void];

// 認証サービスを直接モック
jest.mock("@/feature/auth/application/service/authService", () => ({
  loginWithEmail: (...args: LoginParams) =>
    mockAuthService.loginWithEmail(...args),
}));

describe("Login Screen", () => {
  // テスト共通のデータ
  const testEmail = "test@example.com";
  const testPassword = "password123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form correctly", () => {
    // 準備 - 特に必要なし

    // 実行
    const { getByText, getByTestId } = render(<Login />);

    // 検証
    expect(getByText("Email")).toBeTruthy();
    expect(getByText("Password")).toBeTruthy();
    expect(getByTestId("login-button")).toBeTruthy();
    expect(getByText("Signup")).toBeTruthy();
  });

  it("handles form submission", async () => {
    // 準備
    mockAuthService.loginWithEmail.mockImplementation(
      (email, password, setLoading) => {
        setLoading(true);
        // 処理をシミュレート
        setTimeout(() => setLoading(false), 0);
      },
    );

    // 実行
    const { getByLabelText, getByTestId } = render(<Login />);

    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Password");
    const loginButton = getByTestId("login-button");

    fireEvent.changeText(emailInput, testEmail);
    fireEvent.changeText(passwordInput, testPassword);
    fireEvent.press(loginButton);

    // 検証
    await waitFor(() => {
      expect(mockAuthService.loginWithEmail).toHaveBeenCalledWith(
        testEmail,
        testPassword,
        expect.any(Function),
      );
    });
  });
});
