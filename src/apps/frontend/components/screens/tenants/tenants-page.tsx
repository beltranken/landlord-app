import { Text, TextH4 } from "@/components/atoms/text";
import MainWrapper from "@/components/molecules/main-wrapper/main-wrapper-ui";
import { useTenants } from "@/hooks/queries/useTenants";
import { Tenant } from "@/types";
import { StyleSheet, View } from "react-native";

export default function TenantsPage() {
  const { data, isFetching, fetchNextPage, hasNextPage } = useTenants();

  const tenants: Tenant[] =
    data?.pages.flatMap((page) => page.data as Tenant[]) ?? [];

  return (
    <MainWrapper
      title="Manage your tenants"
      data={tenants}
      hasMore={!!hasNextPage}
      isFetching={isFetching}
      loadMore={fetchNextPage}
      renderItem={({ item }) => (
        <View style={styles.tenantContainer}>
          <TextH4>
            {item.firstName} {item.lastName}
          </TextH4>

          {item.email && <Text>{item.email}</Text>}
          {item.phone && <Text>{item.phone}</Text>}
          {item.relationship && <Text>{item.relationship}</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  tenantContainer: {
    padding: 16,
    gap: 4,
  },
});
