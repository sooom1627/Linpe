import { TouchableOpacity } from "react-native";

export const PrimaryButton = ({
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
      className={`items-center rounded-md p-2 ${
        loading ? "bg-gray-500" : "bg-blue-500"
      }`}
      onPress={onPress}
      disabled={loading}
      testID={testID}
    >
      {children}
    </TouchableOpacity>
  );
};
