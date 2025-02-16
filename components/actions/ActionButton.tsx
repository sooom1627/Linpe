import { type ReactNode } from "react";
import { TouchableOpacity, type TouchableOpacityProps } from "react-native";

interface ActionButtonProps extends TouchableOpacityProps {
  children?: ReactNode;
  size?: "small" | "large";
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const ActionButton = ({
  children,
  size = "small",
  accessibilityLabel,
  accessibilityHint,
  ...props
}: ActionButtonProps) => {
  const buttonSize = size === "small" ? "h-12 w-12" : "h-14 w-14";

  return (
    <TouchableOpacity
      {...props}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      activeOpacity={0.8}
      className={`items-center justify-center rounded-full bg-zinc-700 shadow-sm active:opacity-90 ${buttonSize} ${props.className || ""}`}
    >
      {children}
    </TouchableOpacity>
  );
};
