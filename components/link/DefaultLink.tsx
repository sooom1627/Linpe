import { TouchableOpacity } from "react-native";

export const DefaultLink = ({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity className="text-blue-500 underline" onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};
