import { View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { Title } from "@/components/text/Title";
import { useGetLinks, useOGDataBatch } from "@/feature/links/application/hooks";
import {
  FeaturedLinksList,
  LinksFlatList,
  LoadingCard,
} from "@/feature/links/presentation/components/display";

export const LinksTopView = () => {
  const { links, isError, isLoading } = useGetLinks(10, "top-view");
  const { dataMap, loading: ogLoading } = useOGDataBatch(
    links.map((link) => link.full_url),
  );

  if (isLoading || ogLoading) {
    return (
      <View className="flex flex-col gap-4">
        <Title title="Recommend for you." />
        <View className="flex flex-row flex-wrap items-stretch justify-between gap-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <View key={index} className="w-[48%]">
              <LoadingCard variant="featured" />
            </View>
          ))}
        </View>
        <View className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <LoadingCard key={index} variant="horizontal" />
          ))}
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex items-center justify-center py-8">
        <ThemedText
          text="Error loading data"
          variant="body"
          weight="medium"
          color="error"
        />
      </View>
    );
  }

  if (links.length === 0) {
    return (
      <View className="flex items-center justify-center py-8">
        <ThemedText
          text="No articles yet"
          variant="body"
          weight="medium"
          color="muted"
        />
      </View>
    );
  }

  const featuredLinks = links.slice(0, 2);
  const regularLinks = links.slice(2);

  return (
    <View className="flex flex-col gap-4">
      <Title title="Recommend for you." />
      <FeaturedLinksList links={featuredLinks} ogDataMap={dataMap} />
      <LinksFlatList links={regularLinks} ogDataMap={dataMap} />
    </View>
  );
};
