import { ActivityIndicator, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { Title } from "@/components/text/Title";
import { useTopViewLinks } from "../../hooks/useLinks";
import { FeaturedLinksList } from "../lists/FeaturedList";
import { LinksFlatList } from "../lists/LinksFlatList";

export const LinksTopView = () => {
  const { links, isError, isLoading } = useTopViewLinks();

  if (isLoading) {
    return (
      <View className="flex items-center justify-center py-8">
        <ActivityIndicator size="large" color="#FA4714" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex items-center justify-center py-8">
        <ThemedText variant="body" weight="medium" color="error">
          {["エラーが発生しました。再度お試しください。"]}
        </ThemedText>
      </View>
    );
  }

  if (links.length === 0) {
    return (
      <View className="flex items-center justify-center py-8">
        <ThemedText variant="body" weight="medium" color="muted">
          {["記事がまだありません。"]}
        </ThemedText>
      </View>
    );
  }

  const featuredLinks = links.slice(0, 2);
  const regularLinks = links.slice(2);

  return (
    <View className="flex flex-col gap-4">
      <Title title="Recommend for you." />
      <FeaturedLinksList links={featuredLinks} />
      <LinksFlatList links={regularLinks} />
    </View>
  );
};
