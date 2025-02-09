import { signupWithEmail } from "../authService";
import { Alert, supabase } from "./mocks/authMocks";

describe("signupWithEmail", () => {
  it("エラー発生時は Alert.alert にエラーメッセージが表示される", async () => {
    const setLoading = jest.fn();
    const email = "test@example.com";
    const password = "password123";
    const errorMessage = "サインアップエラー";

    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: { message: errorMessage },
    });

    await signupWithEmail(email, password, setLoading);

    expect(Alert.alert).toHaveBeenCalledWith(errorMessage);
    expect(setLoading).toHaveBeenNthCalledWith(1, true);
    expect(setLoading).toHaveBeenNthCalledWith(2, false);
  });

  it("session が返ってこない場合はメール確認のメッセージが表示される", async () => {
    const setLoading = jest.fn();
    const email = "test@example.com";
    const password = "password123";

    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    await signupWithEmail(email, password, setLoading);

    expect(Alert.alert).toHaveBeenCalledWith(
      "Please check your inbox for email verification!",
    );
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  it("session が存在する場合は Alert.alert が呼ばれない", async () => {
    const setLoading = jest.fn();
    const email = "test@example.com";
    const password = "password123";

    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: { session: {} },
      error: null,
    });

    await signupWithEmail(email, password, setLoading);

    expect(Alert.alert).not.toHaveBeenCalled();
  });
});
