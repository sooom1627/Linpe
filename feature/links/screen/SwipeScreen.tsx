import { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/text/ThemedText";

const DUMMY_CARDS = [
  {
    id: 1,
    title: "ChatGPTを活用した次世代の開発手法",
    description:
      "AIを活用した開発効率の向上と、プロジェクト管理の新しいアプローチについて解説します。",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
  },
  {
    id: 2,
    title: "Reactの最新アップデートとパフォーマンス改善",
    description:
      "React 19の新機能と、アプリケーションのパフォーマンスを最適化するためのベストプラクティス。",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
  },
  {
    id: 3,
    title: "マイクロサービスアーキテクチャの実践ガイド",
    description:
      "大規模アプリケーションにおけるマイクロサービスの導入方法と、運用のポイントを詳しく解説。",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
  },
  {
    id: 4,
    title: "TypeScriptで実現する型安全な開発",
    description:
      "TypeScript 5.0の新機能と、実践的な型システムの活用方法について学びます。",
    imageUrl: "https://images.unsplash.com/photo-1629904853716-f0bc54eea481",
  },
  {
    id: 5,
    title: "クラウドネイティブな開発環境の構築",
    description:
      "AWS、GCP、Azureを活用した最新のクラウドネイティブアーキテクチャの設計と実装。",
    imageUrl: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7",
  },
  {
    id: 6,
    title: "セキュアなWebアプリケーション開発入門",
    description:
      "最新のセキュリティ脅威と対策、OWASPトップ10に基づくセキュリティ実装について。",
    imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb",
  },
  {
    id: 7,
    title: "DevOpsとCI/CDパイプラインの自動化",
    description:
      "GitHubActions、Jenkins、CircleCIを使用した効率的なデプロイメントフローの構築方法。",
    imageUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb",
  },
  {
    id: 8,
    title: "Kubernetes入門：コンテナオーケストレーション",
    description:
      "Kubernetesの基本概念から実践的なクラスター管理まで、包括的に解説します。",
    imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a",
  },
  {
    id: 9,
    title: "AIと機械学習の実務応用事例",
    description:
      "ビジネスにおけるAIの活用事例と、実装に向けた具体的なアプローチ方法について。",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
  },
  {
    id: 10,
    title: "Web3とブロックチェーン技術の最前線",
    description:
      "分散型アプリケーション開発とスマートコントラクトの実装について詳しく解説。",
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
  },
];

export default function SwipeScreen() {
  const [isFinished, setIsFinished] = useState(false);
  const [cards, setCards] = useState(DUMMY_CARDS);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const swiperRef = useRef<Swiper<(typeof DUMMY_CARDS)[number]>>(null);

  const handleReload = () => {
    setCards(DUMMY_CARDS);
    setIsFinished(false);
    setCurrentCardIndex(0);
  };

  if (isFinished) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="mb-4 text-xl">全てのカードを確認しました</Text>
        <TouchableOpacity
          onPress={handleReload}
          className="rounded-lg bg-blue-500 px-6 py-3"
        >
          <Text className="text-white">もう一度見る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="relative flex-1 flex-col items-center justify-center">
      <View className="absolute top-16 h-fit w-full items-center justify-center">
        <Swiper
          ref={swiperRef}
          cards={cards}
          verticalSwipe={true}
          disableBottomSwipe={true}
          renderCard={(card) => (
            <View className="h-fit flex-col items-center justify-center gap-4 bg-transparent">
              <Image
                source={{
                  uri: card.imageUrl,
                }}
                className="aspect-[1.91/1] w-full items-center justify-center rounded-lg bg-slate-50"
              />
            </View>
          )}
          onSwipedLeft={(index: number) => {
            console.log("左にスワイプ");
            setCurrentCardIndex(index + 1);
          }}
          onSwipedRight={(index: number) => {
            console.log("右にスワイプ");
            setCurrentCardIndex(index + 1);
          }}
          onSwipedTop={(index: number) => {
            console.log("上にスワイプ");
            setCurrentCardIndex(index + 1);
          }}
          onSwiped={(index: number) => {
            setCurrentCardIndex(index + 1);
          }}
          onSwipedAll={() => setIsFinished(true)}
          backgroundColor="#ffffff"
          stackSize={3}
          stackSeparation={-25}
          stackScale={5}
        />
      </View>
      <View className="h-42 absolute top-2/4 w-full flex-col items-start justify-start gap-3 rounded-lg px-6">
        <View className="h-40 w-full flex-col items-start justify-start gap-3 rounded-lg bg-red-50 px-6 py-6">
          <ThemedText variant="caption" weight="normal" color="muted" underline>
            {["speakerdeck.com"]}
          </ThemedText>
          <ThemedText
            variant="body"
            weight="semibold"
            color="default"
            numberOfLines={2}
          >
            {cards[currentCardIndex]?.title || ""}
          </ThemedText>
          <View className="flex-col items-start justify-start gap-1">
            <ThemedText variant="body" weight="semibold" color="accent">
              {["description"]}
            </ThemedText>
            <ThemedText variant="body" weight="normal" color="default">
              {cards[currentCardIndex]?.description || ""}
            </ThemedText>
          </View>
        </View>
      </View>
      <View className="absolute bottom-4 flex w-full flex-row justify-center gap-4 px-4 py-4">
        <Text className="text-muted text-sm">
          {`${currentCardIndex + 1} / ${cards.length} - ${cards[currentCardIndex]?.title || ""}`}
        </Text>
      </View>
      <View className="absolute bottom-10 z-10 flex w-full flex-row justify-center gap-4 px-4 py-4">
        <TouchableOpacity
          onPress={() => swiperRef.current?.swipeLeft()}
          className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-red-500"
        >
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (currentCardIndex > 0) {
              swiperRef.current?.swipeBack();
              setCurrentCardIndex((prev) => prev - 1);
            }
          }}
          className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-yellow-500"
        >
          <Ionicons name="star" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swiperRef.current?.swipeRight()}
          className="h-14 w-14 items-center justify-center rounded-full bg-green-500"
        >
          <Ionicons name="heart" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
