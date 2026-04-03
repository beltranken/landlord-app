import { getProperties } from "@/api/sdk.gen";
import MainWrapper from "@/components/molecules/main-wrapper/main-wrapper-ui";
import PropertyCard from "@/components/molecules/property-card/property-card-ui";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";

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
        <PropertyCard item={item} index={index} />
      )}
    />
  );
}
