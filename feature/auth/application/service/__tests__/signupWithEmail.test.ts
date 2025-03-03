import { Alert, createSuccessResponse, supabase } from "./mocks/authMocks";

// 遅延読み込みを使用
const { signupWithEmail } = jest.requireActual("../authService");

describe("signupWithEmail", () => {
  // テスト共通のデータ
  const email = "test@example.com";
  const password = "password123";
  let setLoading: jest.Mock;

  beforeEach(() => {
    // 各テスト前に初期化
    setLoading = jest.fn();
  });

  it("エラー発生時は Alert.alert にエラーメッセージが表示される", async () => {
    // 準備
    const errorMessage = "サインアップエラー";
    const response = {
      data: { session: null },
      error: { message: errorMessage },
    };
    supabase.auth.signUp.mockResolvedValue(response);

    // 実行
    await signupWithEmail(email, password, setLoading);

    // 検証
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email,
      password,
    });
    expect(Alert.alert).toHaveBeenCalledWith(errorMessage);
    expect(setLoading).toHaveBeenNthCalledWith(1, true);
    expect(setLoading).toHaveBeenNthCalledWith(2, false);
  });

  it("session が返ってこない場合はメール確認のメッセージが表示される", async () => {
    // 準備
    supabase.auth.signUp.mockResolvedValue(createSuccessResponse(null));

    // 実行
    await signupWithEmail(email, password, setLoading);

    // 検証
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email,
      password,
    });
    expect(Alert.alert).toHaveBeenCalledWith(
      "Please check your inbox for email verification!",
    );
    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  it("session が存在する場合は Alert.alert が呼ばれない", async () => {
    // 準備
    supabase.auth.signUp.mockResolvedValue(
      createSuccessResponse({ user: { id: "123" } }),
    );

    // 実行
    await signupWithEmail(email, password, setLoading);

    // 検証
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email,
      password,
    });
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);
  });
});
