import { Text, TextH2, TextH5 } from "@/components/atoms/text";
import CardSection from "@/components/molecules/card-section/card-section-ui";
import { Colors, Sizes } from "@/constants";
import {
  DocumentType,
  DocumentUploadRequest,
  documentUploadRequestSchema,
} from "@/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { zodResolver } from "@hookform/resolvers/zod";
import * as DocumentPicker from "expo-document-picker";
import { useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import TenantFileCard from "./tenant-file-card";

type TenantFileSectionProps = {
  files?: Array<{
    id: number | string;
  }>;
};

export default function TenantFileSection({ files }: TenantFileSectionProps) {
  const hasFiles = !!files && files.length > 0;
  const { reset } = useForm<DocumentUploadRequest>({
    resolver: zodResolver(documentUploadRequestSchema),
    defaultValues: {
      name: "",
      uri: "",
      size: 0,
    },
  });

  const handleOnUploadPress = () => {
    DocumentPicker.getDocumentAsync({
      multiple: false,
      type: [
        "image/png",
        "image/jpeg",
        "application/pdf",
        "application/msword",
      ],
    })
      .then((result) => {
        if (result.canceled) {
          Toast.show({
            type: "info",
            text1: "Document selection cancelled",
          });
          return;
        }

        const file = result.assets.at(0);
        if (file) {
          reset({
            name: file.name,
            uri: file.uri,
            type: file.mimeType as DocumentType,
            size: file.size,
          });
        }
      })
      .catch((error) => {
        console.error("Error picking document:", error);
        Toast.show({
          type: "error",
          text1: "Error picking document",
          text2: error.message,
        });
      });
  };

  return (
    <CardSection>
      <TextH2>Documents</TextH2>

      {hasFiles ? (
        files!.map((file) => (
          <TenantFileCard key={file.id} file={file as any} />
        ))
      ) : (
        <Text>No documents uploaded yet.</Text>
      )}

      <Pressable style={styles.fileContainer} onPress={handleOnUploadPress}>
        <View style={styles.headerRow}>
          <TextH5>ADD DOCUMENT</TextH5>
        </View>

        <AntDesign name="download" size={24} color="black" />
      </Pressable>
    </CardSection>
  );
}

const styles = StyleSheet.create({
  fileContainer: {
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    padding: Sizes.padding,
    gap: Sizes.padding,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Sizes.padding,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
