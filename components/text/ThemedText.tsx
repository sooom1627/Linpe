import { Text } from "react-native";
import { twMerge } from "tailwind-merge";

export type ThemedTextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body"
  | "caption"
  | "small";
export type ThemedTextWeight = "normal" | "medium" | "semibold" | "bold";
export type ThemedTextAlign = "left" | "center" | "right";
export type ThemedTextColor =
  | "default"
  | "muted"
  | "white"
  | "accent"
  | "success"
  | "error"
  | "warning"
  | "info";

interface ThemedTextProps {
  children: React.ReactNode;
  variant?: ThemedTextVariant;
  weight?: ThemedTextWeight;
  align?: ThemedTextAlign;
  color?: ThemedTextColor;
  className?: string;
}

const getVariantClasses = (variant: ThemedTextVariant): string => {
  switch (variant) {
    case "h1":
      return "text-4xl leading-tight";
    case "h2":
      return "text-3xl leading-tight";
    case "h3":
      return "text-2xl leading-normal";
    case "h4":
      return "text-xl leading-normal";
    case "body":
      return "text-base leading-relaxed";
    case "caption":
      return "text-sm leading-relaxed";
    case "small":
      return "text-xs leading-normal";
    default:
      return "text-base leading-relaxed";
  }
};

const getWeightClasses = (weight: ThemedTextWeight): string => {
  switch (weight) {
    case "normal":
      return "font-montserrat";
    case "medium":
      return "font-montserrat-medium";
    case "semibold":
      return "font-montserrat-semibold";
    case "bold":
      return "font-montserrat-bold";
    default:
      return "font-montserrat";
  }
};

const getAlignClasses = (align: ThemedTextAlign): string => {
  switch (align) {
    case "left":
      return "text-left";
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    default:
      return "text-left";
  }
};

const getColorClasses = (color: ThemedTextColor): string => {
  switch (color) {
    case "default":
      return "text-zinc-900 dark:text-white";
    case "muted":
      return "text-zinc-500 dark:text-zinc-400";
    case "white":
      return "text-white dark:text-zinc-900";
    case "accent":
      return "text-accent dark:text-accent-400";
    case "success":
      return "text-green-600 dark:text-green-400";
    case "error":
      return "text-red-600 dark:text-red-400";
    case "warning":
      return "text-amber-600 dark:text-amber-400";
    case "info":
      return "text-blue-600 dark:text-blue-400";
    default:
      return "text-zinc-900 dark:text-white";
  }
};

export const ThemedText = ({
  children,
  variant = "body",
  weight = "normal",
  align = "left",
  color = "default",
  className = "",
}: ThemedTextProps) => {
  const classes = twMerge(
    "font-montserrat",
    getVariantClasses(variant),
    getWeightClasses(weight),
    getAlignClasses(align),
    getColorClasses(color),
    className,
  );

  return <Text className={classes}>{children}</Text>;
};
