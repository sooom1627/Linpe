/**
 * expo-routerの型定義を拡張し、useSegments()の戻り値型を
 * 全環境で一貫して扱えるようにします。
 */
import "expo-router";

declare module "expo-router" {
  // useSegmentsの戻り値型を明示的に配列型として宣言
  export function useSegments(): string[];
}
