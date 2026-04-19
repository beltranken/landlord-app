import Sizes from "@/constants/sizes";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface ListFooterProps {
  hasMore?: boolean;
  isFetching?: boolean;
}

export default function ListFooter({
  hasMore,
  isFetching,
}: Readonly<ListFooterProps>) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.footerContainer}>
        {hasMore && isFetching && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  footerContainer: {
    width: "100%",
    alignItems: "center",
    maxWidth: Sizes.maxWidth,
    minHeight: 250,
  },
  loadingContainer: {
    alignItems: "center",
    width: "100%",
    paddingVertical: Sizes.padding,
  },
});
