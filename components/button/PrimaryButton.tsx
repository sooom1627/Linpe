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
      className={`w-full items-center rounded-md p-2 ${
        loading ? "bg-zinc-500" : "bg-zinc-700"
      }`}
      onPress={onPress}
      disabled={loading}
      testID={testID}
    >
      {children}
    </TouchableOpacity>
  );
};
