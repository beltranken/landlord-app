import { Button } from "@/components/atoms/button";
import { Text, TextH2, TextH4 } from "@/components/atoms/text";
import RentStatusUI from "@/components/molecules/rent-status/rent-status-ui";
import { Colors, Sizes } from "@/constants";
import { useRents } from "@/hooks/queries/useRents";
import dayjs from "@/lib/dayjs";
import formatAddress from "@/utils/format-address";
import formatMoney from "@/utils/format-money";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

type Props = {
  tenantId: number;
};

export default function TenantRentsSection({ tenantId }: Props) {
  const router = useRouter();

  const { data, isLoading, isError, isFetching } = useRents({
    tenantId,
    page: 1,
    pageSize: 5,
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="small" />
        <Text>Loading rent history...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text>Unable to load rent history.</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No rent records found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <View style={styles.headerRow}>
        <TextH2>Lease Details</TextH2>

        <Button
          containerStyle={styles.createButtonContainer}
          style={styles.createButton}
          onPress={() => {
            // Navigate to contract creation screen with tenant context
            //router.push(`/contracts/create?tenantId=${tenantId}`);
          }}
        >
          Create contract
        </Button>
      </View>

      {isFetching && !isLoading && (
        <View style={styles.fetchingRow}>
          <ActivityIndicator size="small" />
          <Text>Refreshing...</Text>
        </View>
      )}
      {data.map((rent) => {
        const totalMonths = dayjs(rent.endDate).diff(
          dayjs(rent.startDate),
          "month",
        );

        return (
          <View key={rent.id} style={styles.itemContainer}>
            <View style={styles.itemMetaRow}>
              <Text style={styles.itemMetaLabel}>Status</Text>

              <View style={styles.statusRow}>
                <RentStatusUI status={rent.status} />

                {rent.status === "active" && (
                  <Button
                    containerStyle={styles.terminateButtonContainer}
                    style={styles.terminateButton}
                    textStyles={styles.terminateButtonText}
                    onPress={() => {
                      // TODO: Implement rent termination flow
                    }}
                  >
                    Terminate
                  </Button>
                )}
              </View>
            </View>

            {rent.property && (
              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onPress={() => {
                  router.push(`/properties/${rent.propertyId}`);
                }}
              >
                <View style={[styles.itemMetaRow, , { flex: 1 }]}>
                  <Text style={styles.itemMetaLabel}>Property</Text>

                  <View>
                    <TextH4 style={styles.itemMetaTitle}>
                      {rent.property.name}
                    </TextH4>
                    <Text>{formatAddress(rent.property)}</Text>
                  </View>
                </View>

                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={Colors.text}
                />
              </Pressable>
            )}

            <View style={styles.itemMetaRow}>
              <Text
                style={styles.itemMetaLabel}
              >{`${rent.frequency} Rent`}</Text>

              <View>
                <TextH4 style={styles.itemMetaTitle}>
                  {formatMoney(rent.amount)}
                </TextH4>
                <Text>Due on the 1st</Text>
              </View>
            </View>

            <View style={styles.itemMetaRow}>
              <Text style={styles.itemMetaLabel}>Lease Term</Text>

              <View>
                <TextH4 style={styles.itemMetaTitle}>
                  {dayjs(rent.startDate).format("MMM YYYY")} -{" "}
                  {dayjs(rent.endDate).format("MMM YYYY")}
                </TextH4>
                <Text>{`${totalMonths} months total`} </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    gap: Sizes.padding * 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  createButtonContainer: {
    width: "auto",
  },
  createButton: {
    width: "auto",
    paddingHorizontal: Sizes.padding * 1.5,
    paddingVertical: Sizes.padding * 0.75,
    backgroundColor: Colors.button,
  },
  fetchingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.padding / 2,
  },
  itemContainer: {
    gap: Sizes.padding * 2,
  },
  itemMetaRow: {
    gap: Sizes.padding / 2,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.padding,
  },
  itemMetaLabel: {
    textTransform: "uppercase",
    fontFamily: "Inter-Medium",
  },
  itemMetaTitle: {
    fontFamily: "Inter-SemiBold",
  },
  terminateButtonContainer: {
    width: "auto",
  },
  terminateButton: {
    width: "auto",
    paddingHorizontal: Sizes.padding,
    paddingVertical: Sizes.padding * 0.5,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.textError,
  },
  terminateButtonText: {
    color: Colors.textError,
    fontFamily: "Inter-Medium",
  },
});
