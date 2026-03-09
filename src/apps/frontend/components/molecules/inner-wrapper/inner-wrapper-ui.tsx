import AntDesign from "@expo/vector-icons/AntDesign";
import { Href, useRouter } from "expo-router";
import { PropsWithChildren, ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

interface InnerWrapperUIProps extends PropsWithChildren {
  HeaderComponent?: ReactNode;
  backHref: Href;
}
export default function InnerWrapperUI({
  children,
  HeaderComponent,
  backHref,
}: Readonly<InnerWrapperUIProps>) {
  return (
    <ScrollView stickyHeaderIndices={[0]}>
      <View>
        <BackButton href={backHref} />
        {HeaderComponent}
      </View>
      {children}
    </ScrollView>
  );
}

function BackButton({ href }: Readonly<{ href: Href }>) {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(href);
    }
  };

  return (
    <Pressable style={styles.backBtn} onPress={handleBack}>
      <AntDesign name="arrowleft" size={24} color="black" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    padding: 12,
  },
});
