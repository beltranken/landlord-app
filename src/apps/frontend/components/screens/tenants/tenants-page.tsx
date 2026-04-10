import { Text, TextH4 } from "@/components/atoms/text";
import MainWrapper from "@/components/molecules/main-wrapper/main-wrapper-ui";
import { useTenants } from "@/hooks/queries/useTenants";
import { Tenant } from "@/types";
import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

export default function TenantsPage() {
  const router = useRouter();

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
        <Pressable
          style={styles.tenantContainer}
          onPress={() => {
            router.push(`/tenants/${item.id}`);
          }}
        >
          <View style={styles.tenantDetails}>
            <TextH4>
              {item.firstName} {item.lastName}
            </TextH4>

            {item.email && <Text>{item.email}</Text>}
            {item.phone && <Text>{item.phone}</Text>}
          </View>
          <View>
            <Pressable>
              <Entypo name="dots-three-vertical" size={16} color="black" />
            </Pressable>
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  tenantContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 4,
  },
  tenantDetails: {
    flex: 1,
    gap: 4,
  },
});
