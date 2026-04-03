import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

interface PickImageParam {
  mediaTypes?: ImagePicker.MediaType[];
  isMultiple?: boolean;
}

export default async function pickImage({
  mediaTypes = ["images"],
  isMultiple = false,
}: PickImageParam = {}) {
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    Toast.show({
      type: "error",
      text1: "Permission required",
      text2: "Permission to access the media library is required.",
    });

    throw new Error("Permission to access the media library is required.");
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes,
    allowsEditing: true,
    allowsMultipleSelection: isMultiple,
    aspect: [4, 3],
    quality: 1,
  });

  console.log(result);

  if (result.canceled) {
    Toast.show({
      type: "info",
      text1: "Image picking cancelled",
    });
    throw new Error("Image picking cancelled");
  }

  return result.assets;
}
