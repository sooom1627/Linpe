import { TouchableOpacity } from "react-native";

export const AlertButton = ({
  children,
  onPress,
  loading = false,
  testID,
  accessibilityLabel,
  accessibilityHint,
}: {
  children: React.ReactNode;
  onPress: () => void;
  loading?: boolean;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}) => {
  return (
    <TouchableOpacity
      className={`items-center rounded-md bg-red-500 p-2`}
      onPress={onPress}
      disabled={loading}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      {children}
    </TouchableOpacity>
  );
};
