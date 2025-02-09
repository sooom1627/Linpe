import * as ImagePicker from "expo-image-picker";

import supabase from "@/lib/supabase";

export type UploadAvatarCallback = (
  filePath: string,
  setLoading: (loading: boolean) => void,
) => void;

export const uploadAvatar = async (
  onUpload: UploadAvatarCallback,
  setUploading: (loading: boolean) => void,
): Promise<void> => {
  try {
    setUploading(true);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      allowsEditing: true,
      quality: 0.7,
      exif: false,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      console.log("User cancelled image picker.");
      return;
    }

    const image = result.assets[0];
    console.log("Got image", image);

    if (!image.uri) {
      throw new Error("No image uri!");
    }

    const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());

    const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
    const path = `${Date.now()}.${fileExt}`;
    const { data, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, arraybuffer, {
        contentType: image.mimeType ?? "image/jpeg",
      });

    console.log("Supabase upload result:", { data, error: uploadError });

    if (uploadError) {
      throw uploadError;
    }

    onUpload(data.path, setUploading);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Unknown error occurred during avatar upload");
    }
  } finally {
    setUploading(false);
  }
};
