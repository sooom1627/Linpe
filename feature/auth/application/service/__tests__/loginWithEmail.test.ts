import {
  Alert,
  createErrorResponse,
  createSuccessResponse,
  supabase,
} from "./mocks/authMocks";

// 遅延読み込みを使用
const { loginWithEmail } = jest.requireActual("../authService");

describe("loginWithEmail", () => {
  // テスト共通のデータ
  const email = "test@example.com";
  const password = "password123";
  let setLoading: jest.Mock;

  beforeEach(() => {
    // 各テスト前に初期化
    setLoading = jest.fn();
  });

  it("正常時は setLoading が true と false で呼ばれ、Alert は呼ばれない", async () => {
    // 準備
    supabase.auth.signInWithPassword.mockResolvedValue(createSuccessResponse());

    // 実行
    await loginWithEmail(email, password, setLoading);

    // 検証
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email,
      password,
    });
    expect(setLoading).toHaveBeenNthCalledWith(1, true);
    expect(setLoading).toHaveBeenNthCalledWith(2, false);
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it("エラー時は Alert.alert が呼ばれる", async () => {
    // 準備
    const errorMessage = "ログインエラー";
    supabase.auth.signInWithPassword.mockResolvedValue(
      createErrorResponse(errorMessage),
    );

    // 実行
    await loginWithEmail(email, password, setLoading);

    // 検証
    expect(Alert.alert).toHaveBeenCalledWith(errorMessage);
    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email,
      password,
    });
  });
});
