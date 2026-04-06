import { TextH3 } from "@/components/atoms/text";
import { Colors, Sizes } from "@/constants";
import pickImage from "@/utils/media/pick-image";
import { EvilIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { ImagePickerAsset } from "expo-image-picker";
import { Pressable, StyleSheet, Text, View } from "react-native";

export interface ImageUploadProps {
  image?: Pick<ImagePickerAsset, "uri">;
  onChange: (asset?: ImagePickerAsset) => void;
  label?: string;
  errorText?: string;
}

export default function ImageUpload({
  label = "Tap to upload image",
  image,
  onChange,
  errorText,
}: Readonly<ImageUploadProps>) {
  const handleOnPress = () => {
    pickImage()
      .then((assets) => {
        const asset = assets.at(0);
        if (asset) {
          onChange(asset);
        }
      })
      .catch((error) => {
        console.error("Error picking image:", error);
      });
  };

  const handleOnRemove = () => {
    onChange(undefined);
  };

  return (
    <View style={styles.wrapper}>
      {image ? (
        <View
          style={[
            styles.container,
            styles.imageContainer,
            errorText && styles.containerError,
          ]}
        >
          <Image source={{ uri: image?.uri }} style={styles.image} />

          <View style={styles.editButtonContainer}>
            <Pressable style={styles.editButton} onPress={handleOnPress}>
              <EvilIcons name="pencil" size={24} color={Colors.white} />
            </Pressable>

            <Pressable
              style={[styles.editButton, styles.deleteButton]}
              onPress={handleOnRemove}
            >
              <EvilIcons name="trash" size={24} color={Colors.white} />
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          style={[
            styles.container,
            { paddingVertical: Sizes.padding * 2 },
            errorText && styles.containerError,
          ]}
          onPress={handleOnPress}
        >
          <View style={styles.emptyContainer}>
            <View style={styles.addBox}>
              <MaterialCommunityIcons
                name="camera-plus-outline"
                size={32}
                color={Colors.white}
              />
            </View>

            <TextH3>{label}</TextH3>
          </View>
        </Pressable>
      )}

      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Sizes.padding / 2,
  },
  container: {
    borderRadius: 8,
    borderWidth: 3,
    borderStyle: "dashed",
    borderColor: Colors.inputBorder,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.inputBackground,
  },
  containerError: {
    borderColor: Colors.textError,
  },
  addBox: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    padding: Sizes.padding * 2,
    backgroundColor: Colors.button,
    borderRadius: Sizes.padding,
  },
  emptyContainer: {
    gap: Sizes.padding,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    minHeight: 250,
    overflow: "hidden",
    borderWidth: 0,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  editButton: {
    padding: Sizes.padding / 2,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  editButtonContainer: {
    position: "absolute",
    justifyContent: "center",
    flexDirection: "row",
    gap: Sizes.padding / 3,
    top: Sizes.padding,
    right: Sizes.padding,
  },
  deleteButton: {
    backgroundColor: Colors.textError,
  },
  errorText: {
    fontSize: 12,
    color: Colors.textError,
  },
});
