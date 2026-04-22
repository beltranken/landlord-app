import { GetPropertyResponse } from "@/api/types.gen";
import ListEmpty from "@/components/atoms/list-empty/list-empty";
import ListFooter from "@/components/atoms/list-footer/list-footer";
import ListItemSeparator from "@/components/atoms/list-item-separator/list-item-separator";
import ListCard from "@/components/molecules/list-card/list-card";
import PropertyCard from "@/components/molecules/property-card/property-card-ui";
import SearchInput from "@/components/molecules/search-input/search-input";
import ContractStepNextAction from "@/components/screens/contracts/contract-step-next-action";
import { BaseStyles, Colors } from "@/constants";
import useProperties from "@/hooks/queries/useProperties";
import { useContractCreation } from "@/providers/step-form-provider";
import { listKeyExtractor } from "@/utils/list-key-extractor";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function AddContractStep1Page() {
  const router = useRouter();

  const { setCurrentStep, setStep1Data } = useContractCreation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] =
    useState<GetPropertyResponse["data"]>();

  const { data, isPending, isFetching, hasNextPage } = useProperties();

  const parsedData = useMemo(() => {
    const _data = data?.pages.flatMap((page) => page.data);

    if (!_data || _data.length === 0) {
      return undefined;
    }

    return [
      {
        StickyComponent: (
          <View style={styles.background}>
            <SearchInput
              placeholder="Search property by name or tenant"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        ),
      },
      ..._data,
    ];
  }, [data]);

  const handleOnPress = (property: GetPropertyResponse["data"]) => {
    setSelectedProperty(property);
  };

  const handleOnNext = () => {
    console.log("Next step with selected property ID:", selectedProperty?.id);
    setCurrentStep(2);
    setStep1Data(selectedProperty!);
    router.push("/contracts/add/step2");
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
                      item.id === selectedProperty?.id
                        ? Colors.primary
                        : "transparent",
                  }}
                >
                  <PropertyCard
                    item={item}
                    onPress={() => handleOnPress(item)}
                  />
                </ListCard>
              )}
            </View>
          </View>
        )}
      />

      <ContractStepNextAction
        disabled={!selectedProperty}
        onPress={handleOnNext}
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
  wrapper: {
    flex: 1,
  },
});
