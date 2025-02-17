import { ThemedText } from "./ThemedText";

type TitleProps = {
  title: string;
};

export const Title = ({ title }: TitleProps) => {
  return (
    <ThemedText text={title} variant="h4" weight="medium" color="default" />
  );
};
