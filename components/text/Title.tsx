import { ThemedText } from "./ThemedText";

type TitleProps = {
  title: string;
};

export const Title = ({ title }: TitleProps) => {
  return (
    <ThemedText variant="h4" weight="medium" color="default" className="pt-1">
      {title}
    </ThemedText>
  );
};
