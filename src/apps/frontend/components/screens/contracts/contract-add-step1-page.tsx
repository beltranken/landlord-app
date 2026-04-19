import { Button } from "@/components/atoms/button";
import ListEmpty from "@/components/atoms/list-empty/list-empty";
import ListFooter from "@/components/atoms/list-footer/list-footer";
import ListItemSeparator from "@/components/atoms/list-item-separator/list-item-separator";
import { Text } from "@/components/atoms/text";
import ListCard from "@/components/molecules/list-card/list-card";
import PropertyCard from "@/components/molecules/property-card/property-card-ui";
import SearchInput from "@/components/molecules/search-input/search-input";
import { BaseStyles, Colors, Sizes } from "@/constants";
import useProperties from "@/hooks/queries/useProperties";
import { listKeyExtractor } from "@/utils/list-key-extractor";
import { AntDesign } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function AddContractStep1Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number>();

  const { data, isPending, isFetching, hasNextPage } = useProperties();

  const parsedData = useMemo(() => {
    const _data = data?.pages.flatMap((page) => page.data);

    if (!_data || _data.length === 0) {
      return undefined;
    }

    return [{ StickyComponent }, ..._data];
  }, [data]);

  const StickyComponent = (
    <View style={styles.background}>
      <SearchInput
        placeholder="Search property by name or tenant"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );

  const handleOnPress = (propertyId: number) => {
    setSelectedId(propertyId);
  };

  if (isPending) {
    return <></>;
  }

  return (
    <View style={styles.wrapper}>
      <FlashList
        style={{ width: "100%", flex: 1 }}
        contentContainerStyle={styles.scrollContainer}
        ItemSeparatorComponent={ListItemSeparator}
        ListFooterComponent={
          <ListFooter isFetching={isFetching} hasMore={hasNextPage} />
        }
        ListEmptyComponent={
          <ListEmpty message="No available property to select" />
        }
        stickyHeaderIndices={[0]}
        keyExtractor={listKeyExtractor}
        data={parsedData}
        renderItem={({ item }) => (
          <View style={BaseStyles.wrapper}>
            <View style={BaseStyles.container}>
              {"StickyComponent" in item ? (
                item.StickyComponent
              ) : (
                <ListCard
                  containerStyle={{
                    borderWidth: 2,
                    borderColor:
                      item.id === selectedId ? Colors.primary : "transparent",
                  }}
                >
                  <PropertyCard
                    item={item}
                    onPress={() => handleOnPress(item.id)}
                  />
                </ListCard>
              )}
            </View>
          </View>
        )}
      />

      {selectedId && (
        <View style={BaseStyles.wrapper}>
          <View style={styles.actionContainer}>
            <Button style={styles.nextBtn} containerStyle={{ width: "100%" }}>
              <Text style={styles.nextBtnText}>Next Step</Text>

              <AntDesign name="arrow-right" size={20} color="white" />
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.neutral,
  },
  scrollContainer: {
    width: "100%",
    gap: 0,
  },
  actionContainer: {
    backgroundColor: Colors.white,
    padding: Sizes.padding,
    width: "100%",
  },
  nextBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  nextBtnText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },
  wrapper: {
    flex: 1,
  },
});
