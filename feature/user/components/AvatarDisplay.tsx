import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

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
    return (
      <View className="flex items-center justify-center">
        <Text className="text-gray-500">読み込み中...</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: url }}
      className="rounded-full"
      style={{ width: size, height: size }}
      accessibilityLabel="Avatar"
    />
  );
};
