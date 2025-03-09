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
  const mockUpdateLinkAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // useLinkActionのモック実装
    (useLinkAction as jest.Mock).mockReturnValue({
      deleteLinkAction: mockDeleteLinkAction,
      updateLinkAction: mockUpdateLinkAction,
      isLoading: false,
    });
  });

  describe("handleMarkAsRead", () => {
    it("マークが選択されていない場合、何も実行されないこと", async () => {
      // コンポーネントをレンダリング
      const { getByText } = render(<LinkActionView onClose={mockOnClose} />);

      // マークを選択せずにボタンをクリック
      fireEvent.press(getByText("Mark as "));

      // updateLinkActionが呼ばれないことを確認
      expect(mockUpdateLinkAction).not.toHaveBeenCalled();
      // onCloseも呼ばれないことを確認
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("マークが選択されている場合、updateLinkActionが呼ばれること", async () => {
      // 更新成功のモック
      mockUpdateLinkAction.mockResolvedValue({ success: true });

      // コンポーネントをレンダリング
      const { getByText, getByTestId } = render(
        <LinkActionView onClose={mockOnClose} />,
      );

      // Readマークを選択
      fireEvent.press(getByTestId("mark-action-Read"));

      // マークボタンをクリック
      fireEvent.press(getByText("Mark as Read"));

      // 非同期処理の完了を待つ
      await waitFor(() => {
        // updateLinkActionが正しいパラメータで呼ばれたことを確認
        expect(mockUpdateLinkAction).toHaveBeenCalledWith(
          "test-user-id",
          "test-link-id",
          "Read",
          0,
        );

        // onCloseが呼ばれたことを確認
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it("例外が発生した場合でも、onCloseが呼ばれること", async () => {
      // 例外をスローするモック
      mockUpdateLinkAction.mockRejectedValue(new Error("更新エラー"));

      // コンポーネントをレンダリング
      const { getByText, getByTestId } = render(
        <LinkActionView onClose={mockOnClose} />,
      );

      // Readingマークを選択
      fireEvent.press(getByTestId("mark-action-Reading"));

      // マークボタンをクリック
      fireEvent.press(getByText("Mark as Reading"));

      // 非同期処理の完了を待つ
      await waitFor(() => {
        // updateLinkActionが正しいパラメータで呼ばれたことを確認
        expect(mockUpdateLinkAction).toHaveBeenCalledWith(
          "test-user-id",
          "test-link-id",
          "Reading",
          0,
        );

        // onCloseが呼ばれたことを確認
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe("handleDelete", () => {
    it("リンク削除が成功した場合、onCloseが呼ばれること", async () => {
      // 削除成功のモック
      mockDeleteLinkAction.mockResolvedValue({ success: true });

      // コンポーネントをレンダリング
      const { getByText } = render(<LinkActionView onClose={mockOnClose} />);

      // 削除ボタンをクリック
      fireEvent.press(getByText("Delete Link"));

      // 非同期処理の完了を待つ
      await waitFor(() => {
        // deleteLinkActionが正しいパラメータで呼ばれたことを確認
        expect(mockDeleteLinkAction).toHaveBeenCalledWith(
          "test-user-id",
          "test-link-id",
        );

        // onCloseが呼ばれたことを確認
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it("リンク削除が失敗した場合でも、onCloseが呼ばれること", async () => {
      // 削除失敗のモック
      mockDeleteLinkAction.mockResolvedValue({
        success: false,
        error: new Error("削除に失敗しました"),
      });

      // コンポーネントをレンダリング
      const { getByText } = render(<LinkActionView onClose={mockOnClose} />);

      // 削除ボタンをクリック
      fireEvent.press(getByText("Delete Link"));

      // 非同期処理の完了を待つ
      await waitFor(() => {
        // deleteLinkActionが正しいパラメータで呼ばれたことを確認
        expect(mockDeleteLinkAction).toHaveBeenCalledWith(
          "test-user-id",
          "test-link-id",
        );

        // onCloseが呼ばれたことを確認
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it("例外が発生した場合でも、onCloseが呼ばれること", async () => {
      // 例外をスローするモック
      mockDeleteLinkAction.mockRejectedValue(new Error("ネットワークエラー"));

      // コンポーネントをレンダリング
      const { getByText } = render(<LinkActionView onClose={mockOnClose} />);

      // 削除ボタンをクリック
      fireEvent.press(getByText("Delete Link"));

      // 非同期処理の完了を待つ
      await waitFor(() => {
        // deleteLinkActionが正しいパラメータで呼ばれたことを確認
        expect(mockDeleteLinkAction).toHaveBeenCalledWith(
          "test-user-id",
          "test-link-id",
        );

        // onCloseが呼ばれたことを確認
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });
});
