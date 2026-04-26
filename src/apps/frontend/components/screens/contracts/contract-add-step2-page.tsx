import Checkbox from "@/components/atoms/checkbox/checkbox";
import ListEmpty from "@/components/atoms/list-empty/list-empty";
import ListFooter from "@/components/atoms/list-footer/list-footer";
import ListItemSeparator from "@/components/atoms/list-item-separator/list-item-separator";
import { Text, TextH4 } from "@/components/atoms/text";
import ListCard from "@/components/molecules/list-card/list-card";
import SearchInput from "@/components/molecules/search-input/search-input";
import ContractStepNextAction from "@/components/screens/contracts/contract-step-next-action";
import { BaseStyles, Colors } from "@/constants";
import { useTenants } from "@/hooks/queries/useTenants";
import { useContractCreation } from "@/providers/step-form-provider";
import { Tenant } from "@/types";
import { listKeyExtractor } from "@/utils/list-key-extractor";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function AddContractStep2Page() {
  const router = useRouter();
  const { draftContract, setStep2Data, setCurrentStep } = useContractCreation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTenants, setSelectedTenants] = useState<
    { tenant: Tenant; isPrimary: boolean }[]
  >(draftContract.step2 ?? []);

  const { data, isPending, isFetching, hasNextPage } = useTenants();

  useEffect(() => {
    setStep2Data(selectedTenants);
  }, [selectedTenants, setStep2Data]);

  const parsedData = useMemo(() => {
    const _data = data?.pages.flatMap((page) => page.data) as
      | Tenant[]
      | undefined;

    if (!_data || _data.length === 0) {
      return undefined;
    }

    return [
      {
        StickyComponent: (
          <View style={styles.background}>
            <SearchInput
              placeholder="Search tenant by name"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        ),
      },
      ..._data,
    ];
  }, [data]);

  const isTenantSelected = (tenantId: number) => {
    return selectedTenants.some((entry) => entry.tenant.id === tenantId);
  };

  const handleOnToggleTenant = (tenant: Tenant) => {
    setSelectedTenants((prev) => {
      const existing = prev.find((entry) => entry.tenant.id === tenant.id);

      if (existing) {
        return prev.filter((entry) => entry.tenant.id !== tenant.id);
      }

      return [...prev, { tenant, isPrimary: false }];
    });
  };

  const handleOnTogglePrimary = (tenantId: number) => {
    setSelectedTenants((prev) =>
      prev.map((entry) => ({
        ...entry,
        isPrimary: entry.tenant.id === tenantId ? !entry.isPrimary : false,
      })),
    );
  };

  const hasPrimaryTenant = selectedTenants.some((entry) => entry.isPrimary);

  const handleOnNext = () => {
    if (!hasPrimaryTenant) return;

    setCurrentStep(3);
    router.push("/contracts/add/step3");
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
                <ListCard
                  containerStyle={{
                    borderWidth: 2,
                    borderColor: isTenantSelected(item.id)
                      ? Colors.primary
                      : "transparent",
                  }}
                >
                  <View style={styles.tenantContainer}>
                    <View style={styles.tenantDetails}>
                      <TextH4>
                        {item.firstName} {item.lastName}
                      </TextH4>

                      {item.email && <Text>{item.email}</Text>}
                      {item.phone && <Text>{item.phone}</Text>}

                      {isTenantSelected(item.id) && (
                        <Checkbox
                          checked={Boolean(
                            selectedTenants.find(
                              (entry) => entry.tenant.id === item.id,
                            )?.isPrimary,
                          )}
                          label="is Primary Tenant"
                          containerStyle={styles.primaryCheckbox}
                          onPress={() => handleOnTogglePrimary(item.id)}
                        />
                      )}
                    </View>

                    <View style={styles.checkboxContainer}>
                      <Pressable
                        style={styles.checkboxButton}
                        onPress={() => handleOnToggleTenant(item)}
                      >
                        <Ionicons
                          name={
                            isTenantSelected(item.id)
                              ? "checkbox"
                              : "square-outline"
                          }
                          size={22}
                          color={Colors.primary}
                        />
                      </Pressable>
                    </View>
                  </View>
                </ListCard>
              )}
            </View>
          </View>
        )}
      />

      <ContractStepNextAction
        disabled={!hasPrimaryTenant}
        errorMessage={
          hasPrimaryTenant
            ? undefined
            : "Select at least one primary tenant to continue."
        }
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
  tenantContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  tenantDetails: {
    flex: 1,
    gap: 4,
  },
  checkboxContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxButton: {
    padding: 4,
  },
  primaryCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  wrapper: {
    flex: 1,
  },
});
