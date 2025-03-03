import {
  Alert,
  createErrorResponse,
  createSuccessResponse,
  supabase,
} from "./mocks/authMocks";

// 遅延読み込みを使用
const { signout } = jest.requireActual("../authService");

jest.mock("react-native", () => {
  const mockAlert = {
    alert: jest.fn(),
  };
  return {
    Alert: mockAlert,
  };
});

describe("signout", () => {
  it("エラーがない場合は Alert.alert が呼ばれない", async () => {
    // 成功レスポンスを設定
    supabase.auth.signOut.mockResolvedValue(createSuccessResponse());

    await signout();

    // 検証
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });

  it("エラー発生時は Alert.alert にエラーメッセージが表示される", async () => {
    // テストデータ
    const errorMessage = "サインアウトエラー";

    // エラーレスポンスを設定
    supabase.auth.signOut.mockResolvedValue(createErrorResponse(errorMessage));

    await signout();

    // 検証
    expect(Alert.alert).toHaveBeenCalledWith(errorMessage);
    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });
});
