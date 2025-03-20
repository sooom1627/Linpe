import { Stack } from "expo-router";

export default function LinksLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // カスタムヘッダーを使用するため
        animation: "slide_from_right",
        animationDuration: 200,
        contentStyle: {
          backgroundColor: "white",
        },
        fullScreenGestureEnabled: true, // ジェスチャーでの戻りを許可
      }}
    />
  );
}
