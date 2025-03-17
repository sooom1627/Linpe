import React from "react";
import { Text, View } from "react-native";
import { render } from "@testing-library/react-native";

import { DataFetchState } from "../DataFetchState";

describe("DataFetchState", () => {
  it("正常系: ローディング中の場合、ローディングメッセージを表示する", () => {
    const { getByText } = render(
      <DataFetchState isLoading={true} error={null}>
        <Text>Content</Text>
      </DataFetchState>,
    );

    expect(getByText("読み込み中...")).toBeTruthy();
    expect(() => getByText("Content")).toThrow();
  });

  it("正常系: カスタムローディングメッセージを表示できる", () => {
    const { getByText } = render(
      <DataFetchState
        isLoading={true}
        error={null}
        loadingText="カスタムローディング"
      >
        <Text>Content</Text>
      </DataFetchState>,
    );

    expect(getByText("カスタムローディング")).toBeTruthy();
  });

  it("正常系: エラーがある場合、エラーメッセージを表示する", () => {
    const { getByText } = render(
      <DataFetchState isLoading={false} error={new Error("Test error")}>
        <Text>Content</Text>
      </DataFetchState>,
    );

    expect(getByText("データの取得に失敗しました")).toBeTruthy();
    expect(() => getByText("Content")).toThrow();
  });

  it("正常系: カスタムエラーメッセージを表示できる", () => {
    const { getByText } = render(
      <DataFetchState
        isLoading={false}
        error={new Error("Test error")}
        errorText="カスタムエラー"
      >
        <Text>Content</Text>
      </DataFetchState>,
    );

    expect(getByText("カスタムエラー")).toBeTruthy();
  });

  it("正常系: ローディングでもエラーでもない場合、子要素を表示する", () => {
    const { getByText } = render(
      <DataFetchState isLoading={false} error={null}>
        <Text>Content</Text>
      </DataFetchState>,
    );

    expect(getByText("Content")).toBeTruthy();
  });

  it("正常系: 複数の子要素を持つ場合も正しく表示する", () => {
    const { getByText } = render(
      <DataFetchState isLoading={false} error={null}>
        <View>
          <Text>Content 1</Text>
          <Text>Content 2</Text>
        </View>
      </DataFetchState>,
    );

    expect(getByText("Content 1")).toBeTruthy();
    expect(getByText("Content 2")).toBeTruthy();
  });
});
