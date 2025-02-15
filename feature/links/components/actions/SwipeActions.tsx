import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SwipeActionsProps {
  onSwipeLeft: () => void;
  onSwipeBack: () => void;
  onSwipeRight: () => void;
  canSwipeBack: boolean;
}

export function SwipeActions({
  onSwipeLeft,
  onSwipeBack,
  onSwipeRight,
  canSwipeBack,
}: SwipeActionsProps) {
  return (
    <View className="flex flex-row justify-center gap-4">
      <TouchableOpacity
        onPress={onSwipeLeft}
        className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-red-500"
      >
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onSwipeBack}
        disabled={!canSwipeBack}
        className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-yellow-500"
      >
        <Ionicons name="star" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onSwipeRight}
        className="h-14 w-14 items-center justify-center rounded-full bg-green-500"
      >
        <Ionicons name="heart" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}
