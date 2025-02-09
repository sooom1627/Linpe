import { fireEvent, render } from "@testing-library/react-native";

import { signout } from "../../service/authService";
import { SignoutButton } from "../SignoutButton";

// アイコンコンポーネントをモック
jest.mock("@/components/icons/LogoutIcon", () => ({
  LogoutIcon: () => null,
}));

// authServiceをモック
jest.mock("../../service/authService", () => ({
  signout: jest.fn(),
}));

describe("SignoutButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText } = render(<SignoutButton />);
    expect(getByText("Log out")).toBeTruthy();
  });

  it("calls signout function when pressed", () => {
    const { getByText } = render(<SignoutButton />);
    fireEvent.press(getByText("Log out"));
    expect(signout).toHaveBeenCalledTimes(1);
  });
});
