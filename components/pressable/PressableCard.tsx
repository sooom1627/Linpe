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

export const PressableCard = ({
  children,
  style,
  ...props
}: PressableCardProps) => {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "rgba(0, 0, 0, 0.05)" : "transparent",
          transform: [{ scale: pressed ? 0.98 : 1 }],
          borderRadius: 8,
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
};
