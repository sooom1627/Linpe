import { Ionicons } from "@expo/vector-icons";

interface IconProps {
  size?: number;
  color?: string;
}

export function SwipeLikeIcon({ size = 22, color = "white" }: IconProps) {
  return <Ionicons name="checkmark-outline" size={size} color={color} />;
}
