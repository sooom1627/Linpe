import { Ionicons } from "@expo/vector-icons";

interface IconProps {
  size?: number;
  color?: string;
}

export function SwipeSkipIcon({ size = 22, color = "white" }: IconProps) {
  return <Ionicons name="close-outline" size={size} color={color} />;
}
