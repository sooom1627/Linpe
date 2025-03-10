import * as fs from "fs";
import * as path from "path";

describe("OGデータキャッシュのテスト", () => {
  it("useOGData.tsでキャッシュキーが正しく統一されていることを確認", () => {
    // ファイルパスを取得
    const useOGDataPath = path.resolve(
      __dirname,
      "../../hooks/og/useOGData.ts",
    );

    // ファイルの内容を読み込む
    const fileContent = fs.readFileSync(useOGDataPath, "utf8");

    // LINK_CACHE_KEYSが使用されていることを確認
    expect(fileContent).toContain("import { LINK_CACHE_KEYS }");
    expect(fileContent).toContain("LINK_CACHE_KEYS.OG_DATA");
  });

  it("useOGData.tsでSWRの設定が正しく適用されていることを確認", () => {
    // ファイルパスを取得
    const useOGDataPath = path.resolve(
      __dirname,
      "../../hooks/og/useOGData.ts",
    );

    // ファイルの内容を読み込む
    const fileContent = fs.readFileSync(useOGDataPath, "utf8");

    // SWRオプションが設定されていることを確認
    expect(fileContent).toContain("revalidateOnFocus: false");
    expect(fileContent).toContain("revalidateOnReconnect: false");
    expect(fileContent).toContain("revalidateIfStale: false");
    expect(fileContent).toContain("dedupingInterval: 30 * 24 * 3600 * 1000");
  });

  it("ogService.tsでキャッシュ期間が30日に設定されていることを確認", () => {
    // ファイルパスを取得
    const ogServicePath = path.resolve(__dirname, "../../service/ogService.ts");

    // ファイルの内容を読み込む
    const fileContent = fs.readFileSync(ogServicePath, "utf8");

    // キャッシュ期間が30日に設定されていることを確認
    expect(fileContent).toContain("CACHE_DURATION_MS = 30 * 24 * 3600 * 1000");
  });
});
