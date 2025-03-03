import { fireEvent, render } from "@testing-library/react-native";

import { EmailInput } from "../form/EmailInput";
import { createTestProps } from "./mocks/componentMocks";

describe("EmailInput", () => {
  // テスト共通のデータ
  const defaultEmail = "test@example.com";

  it("renders correctly", () => {
    // 準備
    const setEmail = jest.fn();
    const props = createTestProps({
      email: "",
      setEmail,
    });

    // 実行
    const { getByText, getByLabelText } = render(<EmailInput {...props} />);

    // 検証
    expect(getByText("Email")).toBeTruthy();
    expect(getByLabelText("Email")).toBeTruthy();
  });

  it("handles input changes", () => {
    // 準備
    const setEmail = jest.fn();
    const props = createTestProps({
      email: "",
      setEmail,
    });

    // 実行
    const { getByLabelText } = render(<EmailInput {...props} />);
    const input = getByLabelText("Email");
    fireEvent.changeText(input, defaultEmail);

    // 検証
    expect(setEmail).toHaveBeenCalledWith(defaultEmail);
  });

  it("displays the current email value", () => {
    // 準備
    const setEmail = jest.fn();
    const props = createTestProps({
      email: defaultEmail,
      setEmail,
    });

    // 実行
    const { getByLabelText } = render(<EmailInput {...props} />);
    const input = getByLabelText("Email");

    // 検証
    expect(input.props.value).toBe(defaultEmail);
  });
});
