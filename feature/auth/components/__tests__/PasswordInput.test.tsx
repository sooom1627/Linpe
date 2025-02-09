import { fireEvent, render } from "@testing-library/react-native";

import { PasswordInput } from "../PasswordInput";

describe("PasswordInput", () => {
  it("renders correctly", () => {
    const { getByText, getByLabelText } = render(
      <PasswordInput password="" setPassword={() => {}} />,
    );

    expect(getByText("Password")).toBeTruthy();
    expect(getByLabelText("Password")).toBeTruthy();
  });

  it("handles input changes", () => {
    const setPasswordMock = jest.fn();
    const { getByLabelText } = render(
      <PasswordInput password="" setPassword={setPasswordMock} />,
    );

    const input = getByLabelText("Password");
    fireEvent.changeText(input, "password123");

    expect(setPasswordMock).toHaveBeenCalledWith("password123");
  });

  it("displays the current password value", () => {
    const password = "password123";
    const { getByLabelText } = render(
      <PasswordInput password={password} setPassword={() => {}} />,
    );

    const input = getByLabelText("Password");
    expect(input.props.value).toBe(password);
  });

  it("has secure text entry enabled", () => {
    const { getByLabelText } = render(
      <PasswordInput password="" setPassword={() => {}} />,
    );

    const input = getByLabelText("Password");
    expect(input.props.secureTextEntry).toBe(true);
  });
});
