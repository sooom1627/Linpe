import { TouchableOpacity } from "react-native";

export const AlertButton = ({
  children,
  onPress,
  loading = false,
  testID,
  accessibilityRole = "button",
  accessibilityLabel = "",
  accessibilityHint = "",
}: {
  children: React.ReactNode;
  onPress: () => void;
  loading?: boolean;
  testID?: string;
  accessibilityRole?: "button" | "link" | "tab";
  accessibilityLabel?: string;
  accessibilityHint?: string;
}) => {
  return (
    <TouchableOpacity
      className={`items-center rounded-md bg-red-500 p-2`}
      onPress={onPress}
      disabled={loading}
      testID={testID}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      {children}
    </TouchableOpacity>
  );
};
