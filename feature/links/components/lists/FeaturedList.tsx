import { View } from "react-native";

import { type ArticlePreview, type OGData } from "@/feature/links/types/links";
import { FeaturedLinksCard } from "../cards/FeaturedCard";

type Props = {
  links: ArticlePreview[];
  ogDataMap: { [key: string]: OGData | null };
};

export const FeaturedLinksList = ({ links, ogDataMap }: Props) => {
  return (
    <View className="flex flex-row flex-wrap items-stretch justify-between gap-y-4">
      {links.map((link) => (
        <View key={link.id} className="w-[48%]">
          <FeaturedLinksCard {...link} ogData={ogDataMap[link.full_url]} />
        </View>
      ))}
    </View>
  );
};
