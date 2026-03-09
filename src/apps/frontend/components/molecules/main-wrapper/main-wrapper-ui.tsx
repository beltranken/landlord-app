import GradientBackground from "@/components/atoms/gradient-background/gradient-background-ui";
import TextH2 from "@/components/atoms/text/text-h2-ui";
import Colors from "@/constants/colors";
import Sizes from "@/constants/sizes";
import { PropsWithChildren, ReactElement } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";

interface MainWrapperProps<T> extends PropsWithChildren {
  StickyHeader: ReactElement;
  title?: string;
  data: T[];
  renderItem: ListRenderItem<T>;
}

export default function MainWrapper<T extends { id: number }>({
  data,
  renderItem,
  title,
  children,
  StickyHeader,
}: Readonly<MainWrapperProps<T>>) {
  return (
    <GradientBackground>
      {StickyHeader}
      <View
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            paddingHorizontal: Sizes.padding,
            paddingBottom: Sizes.padding,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              maxWidth: Sizes.maxWidth,
              width: "100%",
            }}
          >
            <TextH2>{title}</TextH2>
          </View>
        </View>

        <View style={styles.contentTopCurv} />
        <View
          style={{
            flex: 1,
            width: "100%",
            maxWidth: Sizes.maxWidth,
            backgroundColor: "white",
          }}
        >
          <FlatList
            style={{ width: "100%" }}
            contentContainerStyle={styles.container}
            ListFooterComponent={<View style={{ height: 150 }}></View>}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 2,
                  backgroundColor: Colors.gray,
                  marginTop: Sizes.padding,
                  borderRadius: 100,
                  overflow: "hidden",
                }}
              ></View>
            )}
            data={data}
            renderItem={renderItem}
          >
            {children}
          </FlatList>
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: Sizes.padding,
    gap: Sizes.padding,
  },
  contentTopCurv: {
    height: 24,
    width: "100%",
    maxWidth: Sizes.maxWidth,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "white",
  },
  content: {},
});
