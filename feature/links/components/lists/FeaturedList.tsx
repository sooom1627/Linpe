import { View } from "react-native";

import { type ArticlePreview } from "@/feature/links/types/links";
import { useOGDataBatch } from "../../hooks/useOGDataBatch";
import { FeaturedLinksCard } from "../cards/FeaturedCard";
import { LoadingCard } from "../cards/LoadingCard";

type Props = {
  links: ArticlePreview[];
};

export const FeaturedLinksList = ({ links }: Props) => {
  const { dataMap, loading } = useOGDataBatch(
    links.map((link) => link.full_url),
  );

  if (loading) {
    return (
      <View className="flex flex-row flex-wrap items-stretch justify-between gap-y-4">
        {Array.from({ length: links.length }).map((_, index) => (
          <View key={index} className="w-[48%]">
            <LoadingCard variant="featured" />
          </View>
        ))}
      </View>
    );
  }

  return (
    <View className="flex flex-row flex-wrap items-stretch justify-between gap-y-4">
      {links.map((link) => (
        <View key={link.id} className="w-[48%]">
          <FeaturedLinksCard {...link} ogData={dataMap[link.full_url]} />
        </View>
      ))}
    </View>
  );
};
