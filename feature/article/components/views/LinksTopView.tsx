import { View } from "react-native";

import { Title } from "@/components/text/Title";
import { type ArticleListItem } from "../../types/links";
import { FeaturedLinksList } from "../lists/FeaturedList";
import { LinksFlatList } from "../lists/LinksFlatList";

const dummyArticles: ArticleListItem[] = [
  {
    id: "1",
    domain: "TechCrunch Japan",
    full_url: "https://reactiive.io/articles/checkbox-interactions",
  },
  {
    id: "2",
    domain: "InfoQ",
    full_url:
      "https://speakerdeck.com/yuhattor/developer-summit-2025-14-d-1-yuki-hattori",
  },
  {
    id: "3",
    domain: "speaer.com",
    full_url: "https://www.youtube.com/live/dT7hlszpO04?si=7SfFdywPVwzaDHY7",
  },
  {
    id: "4",
    domain: "tech-blog.jp",
    full_url:
      "https://techcrunch.com/2025/02/03/tana-snaps-up-25m-with-its-ai-powered-knowledge-graph-for-work-racking-up-a-160k-waitlist/",
  },
  {
    id: "5",
    domain: "mobile-dev.com",
    full_url: "https://note.jp/n/n19559633b13e?gs=ece1f6ba2c4a",
  },
];

export const LinksTopView = () => {
  const featuredLinks = dummyArticles.slice(0, 2);
  const regularLinks = dummyArticles.slice(2);

  return (
    <View className="flex flex-col gap-4">
      <Title title="Recommend for you." />
      <FeaturedLinksList links={featuredLinks} />
      <LinksFlatList links={regularLinks} />
    </View>
  );
};
