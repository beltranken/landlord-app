import { Button } from "@/components/atoms/button";
import { TextH1 } from "@/components/atoms/text";
import Text from "@/components/atoms/text/text-ui";
import { Colors } from "@/constants";
import Sizes from "@/constants/sizes";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FlashList, FlashListProps, ListRenderItem } from "@shopify/flash-list";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import ListCard from "../list-card/list-card";
import SearchInput from "../search-input/search-input";

interface MainWrapperProps<T> {
  data: T[];
  renderItem: ListRenderItem<T>;
  isFetching?: boolean;
  hasMore?: boolean;
  loadMore?: FlashListProps<T>["onEndReached"];
  addButtonText?: string;
  addButtonPressed?: () => void;
}

export default function MainWrapper<T extends { id: number }>({
  data,
  renderItem,
  isFetching,
  hasMore,
  loadMore,
  addButtonText,
  addButtonPressed,
}: Readonly<MainWrapperProps<T>>) {
  const ListHeaderComponent = (
    <View style={styles.wrapper}>
      <View style={styles.headerContainer}>
        <TextH1>Manage your properties</TextH1>
      </View>
    </View>
  );

  const SearchComponent = (
    <View style={styles.listItemWrapper}>
      <View style={styles.configContainer}>
        <SearchInput placeholder="Search property by name or tenant" />

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Button
            containerStyle={{
              width: "auto",
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: Colors.buttonSecondary,
            }}
          >
            <MaterialIcons name="tune" size={24} color={Colors.text} />

            <Text
              style={{
                color: Colors.text,
                fontFamily: "Inter-Medium",
                fontSize: 16,
              }}
            >
              Filter
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );

  const ListFooterComponent = (
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

  const ItemSeparatorComponent = () => (
    <View style={{ height: Sizes.padding }} />
  );

  const handleLoadMore = () => {
    if (loadMore && !isFetching && hasMore) {
      loadMore();
    }
  };

  return (
    <View style={styles.wrapper}>
      <FlashList
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        ListFooterComponent={ListFooterComponent}
        ListHeaderComponent={ListHeaderComponent}
        stickyHeaderIndices={[0]}
        data={[{ type: "header", element: SearchComponent }, ...data]}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={ItemSeparatorComponent}
        renderItem={(param) => {
          if ("type" in param.item && param.item.type === "header") {
            return param.item.element;
          } else {
            return (
              <View style={styles.listItemWrapper}>
                <View style={styles.listItemContainer}>
                  <ListCard>
                    {renderItem(param as Parameters<ListRenderItem<T>>[0])}
                  </ListCard>
                </View>
              </View>
            );
          }
        }}
      />

      {addButtonPressed && (
        <View style={styles.actionWrapper}>
          <View style={styles.actionContainer}>
            <Button
              containerStyle={{ width: "auto" }}
              onPress={addButtonPressed}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Ionicons name="add" size={20} color="white" />

                <Text style={{ color: "white" }}>{addButtonText}</Text>
              </View>
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  container: {
    width: "100%",
    gap: 0,
    backgroundColor: Colors.neutral,
  },
  scrollContainer: {
    width: "100%",
    gap: 0,
  },
  headerContainer: {
    width: "100%",
    alignItems: "center",
    maxWidth: Sizes.maxWidth,
    gap: 40,
    paddingVertical: Sizes.padding * 2,
  },
  listItemWrapper: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: Sizes.padding,
  },
  listItemContainer: {
    width: "100%",
    maxWidth: Sizes.maxWidth,
  },
  configContainer: {
    width: "100%",
    gap: Sizes.padding,
    maxWidth: Sizes.maxWidth,
    paddingVertical: Sizes.padding,
    backgroundColor: Colors.neutral,
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
  actionWrapper: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: Sizes.padding,
    alignItems: "center",
  },
  actionContainer: {
    width: "100%",
    maxWidth: Sizes.maxWidth,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
