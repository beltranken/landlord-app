import ListEmpty from "@/components/atoms/list-empty/list-empty";
import ListFooter from "@/components/atoms/list-footer/list-footer";
import ListItemSeparator from "@/components/atoms/list-item-separator/list-item-separator";
import { Text, TextH4 } from "@/components/atoms/text";
import ListCard from "@/components/molecules/list-card/list-card";
import SearchInput from "@/components/molecules/search-input/search-input";
import { BaseStyles, Colors } from "@/constants";
import { useTenants } from "@/hooks/queries/useTenants";
import { Tenant } from "@/types";
import { listKeyExtractor } from "@/utils/list-key-extractor";
import { FlashList } from "@shopify/flash-list";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function AddContractStep2Page() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isPending, isFetching, hasNextPage } = useTenants();

  const parsedData = useMemo(() => {
    const _data = data?.pages.flatMap((page) => page.data) as
      | Tenant[]
      | undefined;

    if (!_data || _data.length === 0) {
      return undefined;
    }

    return [{ StickyComponent }, ..._data];
  }, [data]);

  const StickyComponent = (
    <View style={styles.background}>
      <SearchInput
        placeholder="Search tenant by name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );

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
          <ListEmpty message="No available tenant to select" />
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
                <ListCard>
                  <View style={styles.tenantContainer}>
                    <View style={styles.tenantDetails}>
                      <TextH4>
                        {item.firstName} {item.lastName}
                      </TextH4>

                      {item.email && <Text>{item.email}</Text>}
                      {item.phone && <Text>{item.phone}</Text>}
                    </View>
                  </View>
                </ListCard>
              )}
            </View>
          </View>
        )}
      />
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
  tenantContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 4,
  },
  tenantDetails: {
    flex: 1,
    gap: 4,
  },
  wrapper: {
    flex: 1,
  },
});
