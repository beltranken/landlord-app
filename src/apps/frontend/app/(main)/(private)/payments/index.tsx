import { ScrollView, StyleSheet, View } from "react-native";

export default function PaymentsScreen() {
  return (
    <ScrollView contentContainerStyle={{ backgroundColor: "red", gap: 20 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <View key={i} style={styles.item} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  contentContainer: {
    paddingBottom: 60,
  },
  stickyHeaderWrapper: {
    backgroundColor: "white",
    zIndex: 10,
  },
  listWrapper: {
    gap: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  item: {
    height: 350,
    backgroundColor: "green",
    borderRadius: 16,
  },
});
