import type { GetRentsResponse } from "@/api";
import { Text, TextH4 } from "@/components/atoms/text";
import ListCard from "@/components/molecules/list-card/list-card";
import MainWrapper from "@/components/molecules/main-wrapper/main-wrapper-ui";
import RentStatusUI from "@/components/molecules/rent-status/rent-status-ui";
import { Colors, Sizes } from "@/constants";
import { useRents } from "@/hooks/queries/useRents";
import dayjs from "@/lib/dayjs";
import formatMoney from "@/utils/format-money";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

type Rent = GetRentsResponse["data"][number];

export default function ContractsPage() {
  const router = useRouter();

  const { data, isFetching } = useRents();

  const contracts: Rent[] = data ?? [];

  const handleOnAdd = () => {
    router.push("/contracts/add");
  };

  return (
    <MainWrapper
      title="Manage your contracts"
      addButtonPressed={handleOnAdd}
      addButtonText="Add Contract"
      data={contracts}
      hasMore={false}
      isFetching={isFetching}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => {
            router.push(`/contracts/${item.id}`);
          }}
        >
          <ListCard>
            <View style={styles.cardContainer}>
              <View style={styles.cardHeader}>
                <TextH4>
                  {item.property?.name ?? `Property #${item.propertyId}`}
                </TextH4>
                <RentStatusUI status={item.status} />
              </View>

              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Amount</Text>
                  <Text style={styles.value}>
                    {formatMoney(item.amount)} / {item.frequency}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Period</Text>
                  <Text style={styles.value}>
                    {dayjs(item.startDate).format("MMM D, YYYY")} –{" "}
                    {dayjs(item.endDate).format("MMM D, YYYY")}
                  </Text>
                </View>

                {item.rentTenants && item.rentTenants.length > 0 && (
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Tenants</Text>
                    <Text style={styles.value}>
                      {item.rentTenants
                        .map((rt) =>
                          rt.tenant
                            ? `${rt.tenant.firstName} ${rt.tenant.lastName}`
                            : `Tenant #${rt.tenantId}`,
                        )
                        .join(", ")}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </ListCard>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: Sizes.padding,
    gap: Sizes.padding,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardDetails: {
    gap: Sizes.padding / 2,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: Colors.secondary,
  },
  value: {
    fontFamily: "Inter-Medium",
  },
});
