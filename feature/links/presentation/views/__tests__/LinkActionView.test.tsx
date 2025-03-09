import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { useLinkAction } from "@/feature/links/application/hooks/link";
import { LinkActionView } from "../LinkActionView";

// モック
jest.mock("@/lib/notification", () => ({
  notificationService: {
    success: jest.fn(),
    error: jest.fn(),
    getErrorMessage: jest.fn((error) =>
      error instanceof Error ? error.message : "不明なエラーが発生しました",
    ),
  },
}));

jest.mock("@/feature/links/application/hooks/link", () => ({
  useLinkAction: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(() => ({
    userId: "test-user-id",
    linkId: "test-link-id",
    imageUrl: "https://example.com/image.jpg",
    title: "テストタイトル",
    domain: "example.com",
    full_url: "https://example.com/test",
    swipeCount: "0",
  })),
}));

jest.mock("swr", () => ({
  useSWRConfig: jest.fn(() => ({
    mutate: jest.fn(),
  })),
}));

describe("LinkActionView", () => {
  const mockOnClose = jest.fn();
  const mockDeleteLinkAction = jest.fn();
  const mockUpdateLinkActionByReadStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // useLinkActionのモック実装
    (useLinkAction as jest.Mock).mockReturnValue({
      deleteLinkAction: mockDeleteLinkAction,
      updateLinkActionByReadStatus: mockUpdateLinkActionByReadStatus,
      isLoading: false,
    });

    mockDeleteLinkAction.mockResolvedValue({ success: true });
    mockUpdateLinkActionByReadStatus.mockResolvedValue({ success: true });
  });

  it("コンポーネントが正しくレンダリングされること", () => {
    const { getByText } = render(<LinkActionView onClose={mockOnClose} />);
    expect(getByText("テストタイトル")).toBeTruthy();
    expect(getByText("Mark the link as")).toBeTruthy();
  });

  it("「Read」ボタンをクリックすると、Readステータスでupdateby読書状態が呼ばれること", async () => {
    const { getByTestId, getByText } = render(
      <LinkActionView onClose={mockOnClose} />,
    );

    // Readマークを選択
    fireEvent.press(getByTestId("mark-action-Read"));
    // 「Mark as Read」ボタンをクリック
    fireEvent.press(getByText("Mark as Read"));

    await waitFor(() => {
      expect(mockUpdateLinkActionByReadStatus).toHaveBeenCalledWith(
        "test-user-id",
        "test-link-id",
        "Read",
        0,
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("「Reading」ボタンをクリックすると、Readingステータスでupdateが呼ばれること", async () => {
    const { getByTestId, getByText } = render(
      <LinkActionView onClose={mockOnClose} />,
    );

    // Readingマークを選択
    fireEvent.press(getByTestId("mark-action-Reading"));
    // 「Mark as Reading」ボタンをクリック
    fireEvent.press(getByText("Mark as Reading"));

    await waitFor(() => {
      expect(mockUpdateLinkActionByReadStatus).toHaveBeenCalledWith(
        "test-user-id",
        "test-link-id",
        "Reading",
        0,
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("「Re-Read」ボタンをクリックすると、Re-Readステータスでupdateが呼ばれること", async () => {
    const { getByTestId, getByText } = render(
      <LinkActionView onClose={mockOnClose} />,
    );

    // Re-Readマークを選択
    fireEvent.press(getByTestId("mark-action-Re-Read"));
    // 「Mark as Re-Read」ボタンをクリック
    fireEvent.press(getByText("Mark as Re-Read"));

    await waitFor(() => {
      expect(mockUpdateLinkActionByReadStatus).toHaveBeenCalledWith(
        "test-user-id",
        "test-link-id",
        "Re-Read",
        0,
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("「Bookmark」ボタンをクリックすると、Bookmarkステータスでupdateが呼ばれること", async () => {
    const { getByTestId, getByText } = render(
      <LinkActionView onClose={mockOnClose} />,
    );

    // Bookmarkマークを選択
    fireEvent.press(getByTestId("mark-action-Bookmark"));
    // 「Mark as Bookmark」ボタンをクリック
    fireEvent.press(getByText("Mark as Bookmark"));

    await waitFor(() => {
      expect(mockUpdateLinkActionByReadStatus).toHaveBeenCalledWith(
        "test-user-id",
        "test-link-id",
        "Bookmark",
        0,
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("「Delete Link」ボタンをクリックすると、deleteLinkActionが呼ばれること", async () => {
    const { getByText } = render(<LinkActionView onClose={mockOnClose} />);

    // 「Delete Link」ボタンをクリック
    fireEvent.press(getByText("Delete Link"));

    await waitFor(() => {
      expect(mockDeleteLinkAction).toHaveBeenCalledWith(
        "test-user-id",
        "test-link-id",
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("updateLinkActionByReadStatusがエラーを返した場合、エラーログが出力されること", async () => {
    const originalConsoleError = console.error;
    console.error = jest.fn();

    mockUpdateLinkActionByReadStatus.mockRejectedValue(
      new Error("テストエラー"),
    );

    const { getByTestId, getByText } = render(
      <LinkActionView onClose={mockOnClose} />,
    );

    // Readマークを選択
    fireEvent.press(getByTestId("mark-action-Read"));
    // 「Mark as Read」ボタンをクリック
    fireEvent.press(getByText("Mark as Read"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });

    console.error = originalConsoleError;
  });

  it("deleteLinkActionがエラーを返した場合、エラーログが出力されること", async () => {
    const originalConsoleError = console.error;
    console.error = jest.fn();

    mockDeleteLinkAction.mockRejectedValue(new Error("テストエラー"));

    const { getByText } = render(<LinkActionView onClose={mockOnClose} />);

    // 「Delete Link」ボタンをクリック
    fireEvent.press(getByText("Delete Link"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });

    console.error = originalConsoleError;
  });
});
