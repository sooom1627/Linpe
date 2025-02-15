import { View } from "react-native";

import { type ArticlePreview } from "@/feature/article/types/links";
import { FeaturedLinksCard } from "../cards/FeaturedCard";

type Props = {
  links: ArticlePreview[];
};

export const FeaturedLinksList = ({ links }: Props) => {
  return (
    <View className="flex flex-row flex-wrap items-stretch justify-between gap-y-4">
      {links.map((link) => (
        <View key={link.id} className="w-[48%]">
          <FeaturedLinksCard {...link} />
        </View>
      ))}
    </View>
  );
};
