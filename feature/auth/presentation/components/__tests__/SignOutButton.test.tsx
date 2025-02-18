import { fireEvent, render } from "@testing-library/react-native";

import { signout } from "@/feature/auth/application/service/authService";
import { SignOutButton } from "@/feature/auth/presentation/components/actions/SignOutButton";

// アイコンコンポーネントをモック
jest.mock("@/components/icons/LogoutIcon", () => ({
  LogoutIcon: () => null,
}));

// authServiceをモック
jest.mock("@/feature/auth/application/service/authService", () => ({
  signout: jest.fn(),
}));

describe("SignoutButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText } = render(<SignOutButton />);
    expect(getByText("Log out")).toBeTruthy();
  });

  it("calls signout function when pressed", () => {
    const { getByText } = render(<SignOutButton />);
    fireEvent.press(getByText("Log out"));
    expect(signout).toHaveBeenCalledTimes(1);
  });
});
