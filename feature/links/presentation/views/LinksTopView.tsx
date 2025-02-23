import { View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { Title } from "@/components/text/Title";
import { useSessionContext } from "@/feature/auth/application/contexts/SessionContext";
import {
  useOGDataBatch,
  useTopViewLinks,
} from "@/feature/links/application/hooks";
import {
  FeaturedLinksList,
  LinksFlatList,
  LoadingCard,
} from "@/feature/links/presentation/components/display";
import { TopViewNoLinksStatus } from "../components/display/status/LinksTopview";

export const LinksTopView = () => {
  const { session } = useSessionContext();
  const {
    links: userLinks,
    isError,
    isLoading: userLinksLoading,
    isEmpty,
  } = useTopViewLinks(session?.user?.id || null);

  const { dataMap, loading: ogLoading } = useOGDataBatch(
    userLinks.map((link) => link.full_url),
  );

  if (userLinksLoading || ogLoading) {
    return (
      <View className="flex flex-col gap-4">
        <Title title="Your Links" />
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

  if (isEmpty) {
    return <TopViewNoLinksStatus />;
  }

  const featuredLinks = userLinks.slice(0, 2);
  const regularLinks = userLinks.slice(2);

  return (
    <View className="flex flex-col gap-4">
      <Title title="Your Links" />
      <FeaturedLinksList links={featuredLinks} ogDataMap={dataMap} />
      {regularLinks.length > 0 && (
        <LinksFlatList links={regularLinks} ogDataMap={dataMap} />
      )}
    </View>
  );
};
