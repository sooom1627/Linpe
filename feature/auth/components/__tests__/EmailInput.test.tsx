import { fireEvent, render } from "@testing-library/react-native";

import { EmailInput } from "../form/EmailInput";

describe("EmailInput", () => {
  it("renders correctly", () => {
    const { getByText, getByLabelText } = render(
      <EmailInput email="" setEmail={() => {}} />,
    );

    expect(getByText("Email")).toBeTruthy();
    expect(getByLabelText("Email")).toBeTruthy();
  });

  it("handles input changes", () => {
    const setEmailMock = jest.fn();
    const { getByLabelText } = render(
      <EmailInput email="" setEmail={setEmailMock} />,
    );

    const input = getByLabelText("Email");
    fireEvent.changeText(input, "test@example.com");

    expect(setEmailMock).toHaveBeenCalledWith("test@example.com");
  });

  it("displays the current email value", () => {
    const email = "test@example.com";
    const { getByLabelText } = render(
      <EmailInput email={email} setEmail={() => {}} />,
    );

    const input = getByLabelText("Email");
    expect(input.props.value).toBe(email);
  });
});
