import { Alert, supabase } from "./mocks/authMocks";

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
    (supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null });

    await signout();

    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it("エラー発生時は Alert.alert にエラーメッセージが表示される", async () => {
    const errorMessage = "サインアウトエラー";

    (supabase.auth.signOut as jest.Mock).mockResolvedValue({
      error: { message: errorMessage },
    });

    await signout();

    expect(Alert.alert).toHaveBeenCalledWith(errorMessage);
  });
});
