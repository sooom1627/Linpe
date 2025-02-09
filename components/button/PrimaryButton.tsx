import { TouchableOpacity } from "react-native";

export const PrimaryButton = ({
  children,
  onPress,
  loading = false,
}: {
  children: React.ReactNode;
  onPress: () => void;
  loading?: boolean;
}) => {
  return (
    <TouchableOpacity
      className={`items-center rounded-md p-2 ${
        loading ? "bg-gray-500" : "bg-blue-500"
      }`}
      onPress={onPress}
      disabled={loading}
    >
      {children}
    </TouchableOpacity>
  );
};
