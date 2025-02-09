import { TouchableOpacity } from "react-native";

export const AlertButton = ({
  children,
  onPress,
  loading = false,
  testID,
}: {
  children: React.ReactNode;
  onPress: () => void;
  loading?: boolean;
  testID?: string;
}) => {
  return (
    <TouchableOpacity
      className={`items-center rounded-md bg-red-500 p-2`}
      onPress={onPress}
      disabled={loading}
      testID={testID}
    >
      {children}
    </TouchableOpacity>
  );
};
