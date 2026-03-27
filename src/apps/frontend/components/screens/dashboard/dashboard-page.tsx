import Card from "@/components/atoms/card/card-ui";
import TextH4 from "@/components/atoms/text/text-h4-ui";
import HomeHeader from "@/components/molecules/home-header/home-header-ui";
import { ScrollView, StyleSheet, View } from "react-native";
import DashboardSummaryCard from "./dashboard-summary-card-ui";

export default function Dashboard() {
  return (
    <View style={{ flex: 1 }}>
      <HomeHeader />

      <View style={{ flex: 1 }}>
        <ScrollView
          stickyHeaderIndices={[0]}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator
        >
          <View>
            <DashboardSummaryCard />

            <View style={{ paddingHorizontal: 20 }}>
              <Card>
                <View>
                  <TextH4>Collection summary</TextH4>
                </View>
              </Card>
            </View>
          </View>

          <View
            style={{ flexDirection: "row", gap: 12, paddingHorizontal: 20 }}
          >
            <View style={{ flex: 1 }}>
              <Card>
                <View>
                  <TextH4>Collection summary</TextH4>
                </View>
              </Card>
            </View>
            <View style={{ flex: 1 }}>
              <Card>
                <View>
                  <TextH4>Open property</TextH4>
                </View>
              </Card>
            </View>
          </View>
          <View style={{ height: 60 }}></View>
        </ScrollView>
      </View>
    </View>
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
});
