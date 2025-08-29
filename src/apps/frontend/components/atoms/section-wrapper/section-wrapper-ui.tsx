import Sizes from "@/constants/sizes";
import { PropsWithChildren } from "react";
import { ColorValue, StyleSheet, View } from "react-native";

interface SectionWrapperProps {
  backgroundColor?: ColorValue;
  noPadding?: boolean;
}

export default function SectionWrapper({
  children,
  noPadding,
  backgroundColor,
}: Readonly<PropsWithChildren<SectionWrapperProps>>) {
  return (
    <View
      style={[
        styles.sectionWrapper,
        { backgroundColor, paddingHorizontal: noPadding ? 0 : Sizes.padding },
      ]}
    >
      <View style={styles.section}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    elevation: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    width: "100%",
    maxWidth: Sizes.maxWidth,
  },
});
