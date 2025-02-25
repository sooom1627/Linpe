import { fireEvent, render, screen } from "@testing-library/react-native";

import { MARK_ACTIONS } from "../actionTypes";
import { MarkActions } from "../MarkActions";

describe("MarkActions", () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it("renders all mark actions", () => {
    render(<MarkActions selectedMark={null} onSelect={mockOnSelect} />);

    MARK_ACTIONS.forEach((action) => {
      expect(screen.getByText(action.label)).toBeTruthy();
    });
  });

  it("applies selected styles when an action is selected", () => {
    const selectedType = MARK_ACTIONS[0].type;
    render(<MarkActions selectedMark={selectedType} onSelect={mockOnSelect} />);

    const selectedButton = screen.getByTestId(`mark-action-${selectedType}`);
    expect(selectedButton.props.className).toContain("bg-zinc-700");

    // 非選択のボタンは異なるスタイルが適用されていることを確認
    const unselectedType = MARK_ACTIONS[1].type;
    const unselectedButton = screen.getByTestId(
      `mark-action-${unselectedType}`,
    );
    expect(unselectedButton.props.className).toContain("bg-zinc-100");
  });

  it("calls onSelect with correct type when an action is pressed", () => {
    render(<MarkActions selectedMark={null} onSelect={mockOnSelect} />);

    MARK_ACTIONS.forEach((action) => {
      const button = screen.getByTestId(`mark-action-${action.type}`);
      fireEvent.press(button);
      expect(mockOnSelect).toHaveBeenCalledWith(action.type);
    });

    expect(mockOnSelect).toHaveBeenCalledTimes(MARK_ACTIONS.length);
  });

  it("applies correct icon colors based on selection", () => {
    const selectedType = MARK_ACTIONS[0].type;
    render(<MarkActions selectedMark={selectedType} onSelect={mockOnSelect} />);

    // 選択されたアクションの要素を確認
    const selectedActionView = screen.getByTestId(
      `mark-action-${selectedType}`,
    );
    expect(selectedActionView).toBeTruthy();
    const selectedIcon = selectedActionView.findByProps({ color: "white" });
    expect(selectedIcon).toBeTruthy();

    // 非選択のアクションの要素を確認
    const unselectedType = MARK_ACTIONS[1].type;
    const unselectedActionView = screen.getByTestId(
      `mark-action-${unselectedType}`,
    );
    expect(unselectedActionView).toBeTruthy();
    const unselectedIcon = unselectedActionView.findByProps({ color: "black" });
    expect(unselectedIcon).toBeTruthy();
  });
});
