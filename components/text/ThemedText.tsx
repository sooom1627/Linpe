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
export type ThemedTextWeight =
  | "thin"
  | "extralight"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";
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
  text: string;
  variant?: ThemedTextVariant;
  weight?: ThemedTextWeight;
  align?: ThemedTextAlign;
  color?: ThemedTextColor;
  className?: string;
  underline?: boolean;
  numberOfLines?: number;
}

const getVariantClasses = (variant: ThemedTextVariant): string => {
  switch (variant) {
    case "h1":
      return "text-4xl leading-tight";
    case "h2":
      return "text-3xl leading-tight";
    case "h3":
      return "text-2xl leading-tight";
    case "h4":
      return "text-xl leading-tight";
    case "body":
      return "text-base leading-tight";
    case "caption":
      return "text-sm leading-tight";
    case "small":
      return "text-xs leading-tight";
    default:
      return "text-base leading-tight";
  }
};

const getWeightClasses = (weight: ThemedTextWeight): string => {
  switch (weight) {
    case "thin":
      return "font-montserrat-thin";
    case "extralight":
      return "font-montserrat-extralight";
    case "light":
      return "font-montserrat-light";
    case "normal":
      return "font-montserrat-regular";
    case "medium":
      return "font-montserrat-medium";
    case "semibold":
      return "font-montserrat-semibold";
    case "bold":
      return "font-montserrat-bold";
    case "extrabold":
      return "font-montserrat-extrabold";
    case "black":
      return "font-montserrat-black";
    default:
      return "font-montserrat-regular";
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
  text,
  variant = "body",
  weight = "normal",
  align = "left",
  color = "default",
  className = "",
  underline = false,
  numberOfLines,
}: ThemedTextProps) => {
  const classes = twMerge(
    "font-sans",
    getVariantClasses(variant),
    getWeightClasses(weight),
    getAlignClasses(align),
    getColorClasses(color),
    underline && "underline",
    className,
  );

  return (
    <Text numberOfLines={numberOfLines} className={classes}>
      {text}
    </Text>
  );
};
