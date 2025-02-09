import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { loginWithEmail } from "../../service/authService";
import { Login } from "../Login";

jest.mock("../../service/authService");

describe("Login Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form correctly", () => {
    const { getByText, getByTestId } = render(<Login />);

    expect(getByText("Email")).toBeTruthy();
    expect(getByText("Password")).toBeTruthy();
    expect(getByTestId("login-button")).toBeTruthy();
    expect(getByText("Signup")).toBeTruthy();
  });

  it("handles form submission", async () => {
    const { getByLabelText, getByTestId } = render(<Login />);

    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Password");
    const loginButton = getByTestId("login-button");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(loginWithEmail).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        expect.any(Function),
      );
    });
  });
});
