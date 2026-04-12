import { TextH5 } from "@/components/atoms/text";
import { Colors, Sizes } from "@/constants";
import { useCreateTenantFile } from "@/hooks/mutations/useCreateTenantFile";
import useSubmittedError from "@/hooks/useSubmittedError";
import {
  DocumentType,
  DocumentUploadRequest,
  documentUploadRequestSchema,
} from "@/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { zodResolver } from "@hookform/resolvers/zod";
import * as DocumentPicker from "expo-document-picker";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

type TenantAddDocumentButtonProps = {
  tenantId: number;
};

export function TenantAddDocumentButton({
  tenantId,
}: TenantAddDocumentButtonProps) {
  const [isChanged, setIsChanged] = useState(false);
  const { mutate } = useCreateTenantFile();
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<DocumentUploadRequest>({
    resolver: zodResolver(documentUploadRequestSchema),
    defaultValues: {
      name: "",
      uri: "",
      size: 0,
    },
  });

  const submittedErrors = useSubmittedError({ errors, isSubmitted });

  const errorMsg = useMemo(() => {
    if (!submittedErrors) return undefined;

    return (
      submittedErrors.name?.message ??
      submittedErrors.uri?.message ??
      submittedErrors.size?.message
    );
  }, [submittedErrors]);

  const onReset = () => {
    setIsChanged(false);
    reset({
      name: "",
      uri: "",
      size: 0,
    });
  };

  const handleOnSave = ({ uri, ...data }: DocumentUploadRequest) => {
    mutate({
      tenantId,
      body: data,
    });
  };

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
          setIsChanged(true);
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
    <Pressable
      style={styles.fileContainer}
      onPress={handleOnUploadPress}
      disabled={isChanged}
    >
      <View style={styles.headerRow}>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextH5 numberOfLines={1} ellipsizeMode="tail">
              {field.value || "ADD DOCUMENT"}
            </TextH5>
          )}
        />
      </View>

      {isChanged ? (
        <View style={styles.confirmationRow}>
          <Pressable onPress={handleSubmit(handleOnSave)}>
            <AntDesign name="check" size={16} color={Colors.success} />
          </Pressable>

          <Pressable onPress={onReset}>
            <AntDesign name="close" size={16} color={Colors.danger} />
          </Pressable>
        </View>
      ) : (
        <AntDesign name="download" size={24} color={Colors.text} />
      )}
    </Pressable>
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
  confirmationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.padding,
  },
});
