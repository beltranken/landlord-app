import { getProperties } from "@/api/sdk.gen";
import Text from "@/components/atoms/text/text-ui";
import ImageView from "@/components/molecules/image-view/image-view";
import MainWrapper from "@/components/molecules/main-wrapper/main-wrapper-ui";
import PropertyStatusUI from "@/components/molecules/property-status/property-status-ui";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

export default function PropertiesPage() {
  const router = useRouter();

  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["properties"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getProperties({
        query: { page: pageParam },
      });

      if (!response.data || response.error) {
        throw new Error(
          response.error?.message ?? "Failed to fetch properties",
        );
      }

      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });

  const properties = data?.pages.flatMap((page) => page.data) ?? [];

  const handleOnAdd = () => {
    router.push("/properties/add");
  };

  return (
    <MainWrapper
      addButtonPressed={handleOnAdd}
      addButtonText="Add Property"
      data={properties}
      hasMore={!!hasNextPage}
      isFetching={isFetching}
      loadMore={fetchNextPage}
      renderItem={({ index, item }) => (
        <Pressable
          key={index}
          style={{ flexDirection: "row", justifyContent: "space-between" }}
          onPress={() => {
            router.push(`/properties/${item.id}`);
          }}
        >
          <View style={{ flex: 1, gap: 8 }}>
            <View style={{ width: "100%", height: 256 }}>
              <ImageView
                source={{
                  uri: `https://picsum.photos/200?random=${index + 1}`,
                }}
              />
            </View>

            <View style={{ justifyContent: "space-between" }}>
              <View>
                <Text style={{ fontWeight: "500" }}>{item.name}</Text>
                <Text>{item.city}</Text>
              </View>

              <PropertyStatusUI status={item.propertyStatus} />
            </View>
          </View>
          <View />
        </Pressable>
      )}
    />
  );
}
