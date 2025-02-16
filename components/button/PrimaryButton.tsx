import { TouchableOpacity } from "react-native";

export const PrimaryButton = ({
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
      className={`w-full items-center rounded-md p-2 ${
        loading ? "bg-zinc-500" : "bg-zinc-700"
      }`}
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
