import { Stack } from "expo-router";

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "modal",
        animation: "slide_from_left",
        animationDuration: 200,
        contentStyle: {
          backgroundColor: "white",
        },
        fullScreenGestureEnabled: true,
      }}
    />
  );
}
