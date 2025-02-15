import { Text, View } from "react-native";
import Swiper from "react-native-deck-swiper";

const DUMMY_CARDS = [
  { id: 1, title: "カード 1" },
  { id: 2, title: "カード 2" },
  { id: 3, title: "カード 3" },
  { id: 4, title: "カード 4" },
  { id: 5, title: "カード 5" },
];

export default function SwipeScreen() {
  return (
    <View className="flex items-center justify-center">
      <Swiper
        cards={DUMMY_CARDS}
        renderCard={(card) => (
          <View className="aspect-[1.91/1] w-full items-center justify-center rounded-lg bg-slate-500">
            <Text className="text-2xl font-bold text-white">{card.title}</Text>
          </View>
        )}
        onSwipedLeft={() => console.log("左にスワイプ")}
        onSwipedRight={() => console.log("右にスワイプ")}
        cardIndex={0}
        backgroundColor="#ffffff"
        stackSize={3}
        stackSeparation={-25}
        stackScale={5}
        infinite
      />
    </View>
  );
}
