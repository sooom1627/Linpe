import { render } from "@testing-library/react-native";

import { SignoutButton } from "../SignoutButton";

describe("SignoutButton", () => {
  it("renders correctly", () => {
    const { getByText } = render(<SignoutButton />);

    expect(getByText("Signout")).toBeTruthy();
  });
});
