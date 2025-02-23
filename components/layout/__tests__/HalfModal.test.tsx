import { useRef } from "react";
import { Text } from "react-native";
import { type BottomSheetModal } from "@gorhom/bottom-sheet";
import { render } from "@testing-library/react-native";

import { HalfModal } from "../HalfModal";

describe("HalfModal", () => {
  const TestComponent = () => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    return (
      <HalfModal bottomSheetRef={bottomSheetRef} onClose={() => {}}>
        <Text>Test Content</Text>
      </HalfModal>
    );
  };

  it("renders children correctly", () => {
    const { getByText } = render(<TestComponent />);
    expect(getByText("Test Content")).toBeTruthy();
  });
});
