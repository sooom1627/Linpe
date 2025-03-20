import { type OGData } from "@/feature/links/domain/models/types";

// 画像URLの最大長
const MAX_IMAGE_URL_LENGTH = 1000;

/**
 * 最適な画像URLを取得する
 * OGデータ内の画像URL優先、次にパラメータのURLを使用（長さ制限あり）
 * @param ogData OGデータ
 * @param rawImageUrl パラメータから取得した画像URL
 * @returns 最適な画像URL
 */
export const getOptimalImageUrl = (
  ogData: OGData | null | undefined,
  rawImageUrl: string | undefined,
): string => {
  // OGデータの画像を優先（キャッシュされている可能性が高い）
  if (ogData?.image) {
    return ogData.image;
  }

  // パラメータからの画像URL（長さ制限あり）
  if (rawImageUrl && rawImageUrl.length <= MAX_IMAGE_URL_LENGTH) {
    try {
      // URLとして有効か確認
      new URL(rawImageUrl);
      return rawImageUrl;
    } catch {
      // 無効なURLの場合は空文字を返す
      return "";
    }
  }

  // いずれも条件を満たさない場合は空文字を返す
  return "";
};
