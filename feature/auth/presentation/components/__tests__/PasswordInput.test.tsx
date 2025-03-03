import { fireEvent, render } from "@testing-library/react-native";

import { PasswordInput } from "../form/PasswordInput";
import { createTestProps } from "./mocks/componentMocks";

describe("PasswordInput", () => {
  // テスト共通のデータ
  const defaultPassword = "password123";

  it("renders correctly", () => {
    // 準備
    const setPassword = jest.fn();
    const props = createTestProps({
      password: "",
      setPassword,
    });

    // 実行
    const { getByText, getByLabelText } = render(<PasswordInput {...props} />);

    // 検証
    expect(getByText("Password")).toBeTruthy();
    expect(getByLabelText("Password")).toBeTruthy();
  });

  it("handles input changes", () => {
    // 準備
    const setPassword = jest.fn();
    const props = createTestProps({
      password: "",
      setPassword,
    });

    // 実行
    const { getByLabelText } = render(<PasswordInput {...props} />);
    const input = getByLabelText("Password");
    fireEvent.changeText(input, defaultPassword);

    // 検証
    expect(setPassword).toHaveBeenCalledWith(defaultPassword);
  });

  it("displays the current password value", () => {
    // 準備
    const setPassword = jest.fn();
    const props = createTestProps({
      password: defaultPassword,
      setPassword,
    });

    // 実行
    const { getByLabelText } = render(<PasswordInput {...props} />);
    const input = getByLabelText("Password");

    // 検証
    expect(input.props.value).toBe(defaultPassword);
  });

  it("has secure text entry enabled", () => {
    // 準備
    const setPassword = jest.fn();
    const props = createTestProps({
      password: "",
      setPassword,
    });

    // 実行
    const { getByLabelText } = render(<PasswordInput {...props} />);
    const input = getByLabelText("Password");

    // 検証
    expect(input.props.secureTextEntry).toBe(true);
  });
});
