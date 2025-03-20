import { Redirect } from "expo-router";

/**
 * bottom-sheetフォルダのルートコンポーネント
 * link-inputへリダイレクトします
 */
export default function BottomSheetIndex() {
  return <Redirect href="/(protected)/bottom-sheet/link-input" />;
}
