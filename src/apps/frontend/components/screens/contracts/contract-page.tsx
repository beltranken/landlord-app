import { Button } from "@/components/atoms/button";
import { Text, TextH2, TextH4 } from "@/components/atoms/text";
import CardSection from "@/components/molecules/card-section/card-section-ui";
import InnerWrapper from "@/components/molecules/inner-wrapper/inner-wrapper-ui";
import NotFound from "@/components/molecules/not-found/not-found-ui";
import RentStatusUI from "@/components/molecules/rent-status/rent-status-ui";
import { Colors, Sizes } from "@/constants";
import { useRent } from "@/hooks/queries/useRent";
import dayjs from "@/lib/dayjs";
import formatAddress from "@/utils/format-address";
import formatMoney from "@/utils/format-money";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

export default function ContractPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { isLoading, isPending, data: contract } = useRent(Number(id));

  if (isPending) {
    return <></>;
  }

  if (contract === undefined) {
    return <NotFound message="Contract not found" />;
  }

  const totalMonths = dayjs(contract.endDate).diff(
    dayjs(contract.startDate),
    "month",
  );

  return (
    <InnerWrapper isLoading={isLoading} backFallBackUrl="/contracts">
      <View style={{ gap: Sizes.padding * 1.5 }}>
        <View style={{ gap: Sizes.padding / 2 }}>
          <View style={styles.headerRow}>
            <TextH2>
              {contract.property?.name ?? `Property #${contract.propertyId}`}
            </TextH2>
            <RentStatusUI status={contract.status} />
          </View>
        </View>

        <View style={styles.actionRow}>
          {contract.status === "active" && (
            <Button
              containerStyle={{ width: "auto" }}
              style={{
                backgroundColor: Colors.buttonSecondary,
                borderWidth: 1,
                borderColor: Colors.inputBorder,
              }}
              textStyles={{ color: Colors.secondary }}
            >
              Terminate
            </Button>
          )}
        </View>

        <CardSection title="Contract Details">
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Amount</Text>
              <TextH4>{formatMoney(contract.amount)}</TextH4>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Frequency</Text>
              <TextH4 style={{ textTransform: "capitalize" }}>
                {contract.frequency}
              </TextH4>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Lease Term</Text>
              <View>
                <TextH4>
                  {dayjs(contract.startDate).format("MMM D, YYYY")} –{" "}
                  {dayjs(contract.endDate).format("MMM D, YYYY")}
                </TextH4>
                <Text>{totalMonths} months total</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Grace Period</Text>
              <TextH4>{contract.gracePeriodDays} days</TextH4>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Next Billing</Text>
              <TextH4>
                {dayjs(contract.nextBillingDate).format("MMM D, YYYY")}
              </TextH4>
            </View>
          </View>
        </CardSection>

        {contract.property && (
          <CardSection title="Property">
            <Pressable
              style={styles.propertyRow}
              onPress={() => {
                router.push(`/properties/${contract.propertyId}`);
              }}
            >
              <View style={{ flex: 1 }}>
                <TextH4>{contract.property.name}</TextH4>
                <Text>{formatAddress(contract.property)}</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={Colors.text}
              />
            </Pressable>
          </CardSection>
        )}

        {contract.rentTenants && contract.rentTenants.length > 0 && (
          <CardSection title="Tenants">
            <View style={styles.detailsContainer}>
              {contract.rentTenants.map((rt) => (
                <View key={rt.id} style={styles.tenantRow}>
                  <View style={{ flex: 1 }}>
                    <TextH4>
                      {rt.tenant
                        ? `${rt.tenant.firstName} ${rt.tenant.lastName}`
                        : `Tenant #${rt.tenantId}`}
                    </TextH4>
                    {rt.isPrimary && (
                      <Text style={styles.primaryBadge}>Primary</Text>
                    )}
                    {rt.relationship && <Text>{rt.relationship}</Text>}
                  </View>
                </View>
              ))}
            </View>
          </CardSection>
        )}
      </View>
    </InnerWrapper>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    gap: Sizes.padding,
    flexWrap: "wrap",
    alignItems: "center",
  },
  actionRow: {
    flexDirection: "row",
    gap: Sizes.padding,
    justifyContent: "space-evenly",
  },
  detailsContainer: {
    gap: Sizes.padding,
  },
  detailRow: {
    gap: Sizes.padding / 2,
  },
  label: {
    color: Colors.secondary,
    textTransform: "capitalize",
    fontFamily: "Inter-Bold",
  },
  propertyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tenantRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  primaryBadge: {
    color: Colors.primary,
    fontFamily: "Inter-Medium",
    fontSize: 12,
  },
});
