import MainHeader from "@/components/molecules/main-header/main-header-ui";
import MainWrapper from "@/components/molecules/main-wrapper/main-wrapper-ui";
import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import Text from "@/components/atoms/text/text-ui";
import {} from "@shared/db";

export default function Properties() {
  const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

  return (
    <MainWrapper
      title="Properties"
      StickyHeader={<MainHeader />}
      data={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]}
      renderItem={({ index }) => (
        <Pressable
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              gap: 8,
            }}
          >
            <Image
              source={{
                uri: `https://picsum.photos/200?random=${index + 1}`,
              }}
              style={{ width: 100, height: 100, borderRadius: 8 }}
            />
            <View>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>Test</Text>
            </View>
          </View>
          <View></View>
        </Pressable>
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
