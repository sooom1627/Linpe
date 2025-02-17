import { View } from "react-native";

import {
  type LinkPreview,
  type OGData,
} from "@/feature/links/domain/models/types/links";
import { FeaturedLinksCard } from "../cards/FeaturedCard";

type Props = {
  links: LinkPreview[];
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
