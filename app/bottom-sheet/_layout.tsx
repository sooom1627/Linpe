import { Stack } from "expo-router";

import { sheetScreenOptions } from "@/components/layout/bottom-sheet/constants/screenOption";

export default function BottomSheetLayout() {
  return (
    <Stack>
      <Stack.Screen name="link-input" options={sheetScreenOptions} />
      <Stack.Screen name="link-action" options={sheetScreenOptions} />
    </Stack>
  );
}
