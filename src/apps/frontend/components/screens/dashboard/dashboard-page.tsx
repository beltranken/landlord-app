import { ScrollView, StyleSheet, View } from "react-native";
import DashboardSummaryCard from "./dashboard-summary-card-ui";
import MainHeader from "@/components/organisms/main-header/main-header-ui";

export default function Dashboard() {
  return (
    <ScrollView
      stickyHeaderIndices={[0]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator
    >
      <MainHeader />
      <View>
        <DashboardSummaryCard />

        <View style={styles.listWrapper}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={i} style={styles.item} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    gap: 20,
    paddingBottom: 60,
  },
  stickyHeaderWrapper: {
    paddingHorizontal: 20,
    zIndex: 10,
    flexDirection: "row",
    gap: 20,
  },
  listWrapper: {
    gap: 20,
    paddingHorizontal: 20,
  },
  item: {
    height: 350,
    backgroundColor: "green",
    borderRadius: 16,
  },
});
