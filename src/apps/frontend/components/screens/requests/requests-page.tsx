import MainWrapper from "@/components/molecules/main-wrapper/main-wrapper-ui";
import { StyleSheet, View } from "react-native";

export default function Requests() {
  return (
    <MainWrapper
      title="Requests"
      data={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]}
      renderItem={({ index }) => (
        <View
          style={[
            styles.test,
            { backgroundColor: index % 2 === 0 ? "green" : "blue" },
          ]}
        ></View>
      )}
    ></MainWrapper>
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
  test: {
    height: 450,
    width: "100%",
  },
});
