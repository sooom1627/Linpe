import { Stack } from "expo-router";

export default function BottomSheetLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="link-input"
        options={{
          presentation: "formSheet",
          contentStyle: {
            backgroundColor: "",
            height: 280,
          },
          sheetGrabberVisible: false,
          gestureDirection: "vertical",
          animation: "slide_from_bottom",
          headerShown: false,
          sheetInitialDetentIndex: 0,
          sheetAllowedDetents: [0.38, 0.38],
        }}
      />
    </Stack>
  );
}
