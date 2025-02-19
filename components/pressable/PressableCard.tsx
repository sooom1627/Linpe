import { useState } from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type PressableCardProps = Omit<PressableProps, "style"> & {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export const PressableCard = ({ children, ...props }: PressableCardProps) => {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      {...props}
      className={pressed ? "opacity-50" : "opacity-100"}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      {children}
    </Pressable>
  );
};
