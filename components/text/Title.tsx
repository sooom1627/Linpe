import { ThemedText } from "./ThemedText";

type TitleProps = {
  title: string;
};

export const Title = ({ title }: TitleProps) => {
  return (
    <ThemedText variant="h4" weight="semibold" color="default">
      {title}
    </ThemedText>
  );
};
