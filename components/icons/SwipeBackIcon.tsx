import { Ionicons } from "@expo/vector-icons";

interface IconProps {
  size?: number;
  color?: string;
}

export function SwipeBackIcon({ size = 22, color = "white" }: IconProps) {
  return <Ionicons name="return-up-back-outline" size={size} color={color} />;
}
