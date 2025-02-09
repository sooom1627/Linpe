import { Alert, supabase } from "./mocks/authMocks";

// 遅延読み込みを使用
const { loginWithEmail } = jest.requireActual("../authService");

describe("loginWithEmail", () => {
  it("正常時は setLoading が true と false で呼ばれ、Alert は呼ばれない", async () => {
    const setLoading = jest.fn();
    const email = "test@example.com";
    const password = "password123";

    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      error: null,
    });

    await loginWithEmail(email, password, setLoading);

    expect(setLoading).toHaveBeenNthCalledWith(1, true);
    expect(setLoading).toHaveBeenNthCalledWith(2, false);
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it("エラー時は Alert.alert が呼ばれる", async () => {
    const setLoading = jest.fn();
    const email = "test@example.com";
    const password = "password123";
    const errorMessage = "ログインエラー";

    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      error: { message: errorMessage },
    });

    await loginWithEmail(email, password, setLoading);

    expect(Alert.alert).toHaveBeenCalledWith(errorMessage);
    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);
  });
});
