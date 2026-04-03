import { TextH4 } from "@/components/atoms/text";
import { Colors } from "@/constants";
import Sizes from "@/constants/sizes";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export type CardSectionProps = {
  title?: string;
  children: ReactNode;
};

export default function CardSection({
  title,
  children,
}: Readonly<CardSectionProps>) {
  return (
    <View style={styles.cardWrapper}>
      {title && <TextH4>{title}</TextH4>}
      <View style={styles.card}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    gap: 16,
  },
  card: {
    backgroundColor: Colors.neutral,
    borderRadius: 8,
    padding: Sizes.padding * 2,
    gap: Sizes.padding * 1.5,
  },
});
