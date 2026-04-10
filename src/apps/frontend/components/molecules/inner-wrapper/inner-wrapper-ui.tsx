import { Button } from "@/components/atoms/button";
import Loading from "@/components/atoms/loading/loading";
import { TextH1 } from "@/components/atoms/text";
import { Colors } from "@/constants";
import Sizes from "@/constants/sizes";
import { Href, useRouter } from "expo-router";
import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

type InnerWrapperProps = {
  title?: string;
  onSubmit?: () => void;
  isLoading: boolean;
  submitButtonLabel?: string;
  backButtonLabel?: string;
  backFallBackUrl?: Href;
} & PropsWithChildren;

export default function InnerWrapper({
  title,
  onSubmit,
  isLoading,
  submitButtonLabel = "Save",
  backButtonLabel = "Cancel",
  backFallBackUrl = "/",
  children,
}: Readonly<InnerWrapperProps>) {
  const router = useRouter();

  const handleOnBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push(backFallBackUrl);
    }
  };

  return (
    <ScrollView style={{ width: "100%" }}>
      <View style={styles.container}>
        {title && <TextH1>{title}</TextH1>}

        {children}

        {onSubmit ? (
          <View style={styles.btnContainer}>
            <Button onPress={onSubmit}>{submitButtonLabel}</Button>

            <Button
              style={styles.btnCancel}
              textStyles={{ color: Colors.text }}
              containerStyle={{ width: "auto" }}
              onPress={handleOnBack}
            >
              {backButtonLabel}
            </Button>
          </View>
        ) : (
          <View></View>
        )}

        <Loading visible={isLoading} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: Sizes.padding * 3,
    paddingHorizontal: Sizes.padding,
  },
  btnContainer: {
    gap: Sizes.padding,
    paddingBottom: Sizes.padding * 3,
  },
  btnCancel: {
    backgroundColor: Colors.buttonSecondary,
    boxShadow: "none",
  },
});
