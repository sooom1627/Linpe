import React, { useEffect, useState } from "react";
import { Animated, Easing, Image, View } from "react-native";

import supabase from "@/lib/supabase";

interface AvatarDisplayProps {
  imagePath: string;
  size?: number;
}

export const AvatarDisplay = ({
  imagePath,
  size = 150,
}: AvatarDisplayProps) => {
  const [url, setUrl] = useState<string | null>(null);
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ).start();
  }, [shimmerAnim]);

  useEffect(() => {
    const getSignedUrl = async () => {
      const { data: signedURL } = await supabase.storage
        .from("avatars")
        .createSignedUrl(imagePath, 86400);

      if (signedURL?.signedUrl) {
        setUrl(signedURL.signedUrl);
      } else {
        console.error("Unable to get signed URL");
      }
    };

    getSignedUrl();
  }, [imagePath]);

  if (!url) {
    const translateX = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-size, size * 2],
    });

    return (
      <View
        className="overflow-hidden rounded-full bg-zinc-200"
        style={{ width: size, height: size }}
      >
        <Animated.View
          className="absolute h-full w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{
            transform: [{ translateX }],
          }}
        />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: url }}
      className="rounded-full border border-zinc-200"
      style={{ width: size, height: size }}
      accessibilityLabel="Avatar"
      resizeMode="cover"
    />
  );
};
