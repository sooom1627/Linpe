export const sheetScreenOptions = {
  presentation: "formSheet" as const,
  contentStyle: {
    backgroundColor: "transparent",
    height: 280,
  },
  sheetGrabberVisible: false,
  gestureDirection: "vertical" as const,
  animation: "slide_from_bottom" as const,
  headerShown: false,
  sheetInitialDetentIndex: 0,
  sheetAllowedDetents: [0.38, 0.38],
};
