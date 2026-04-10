import MainWrapper from "@/components/molecules/main-wrapper/main-wrapper-ui";
import PropertyCard from "@/components/molecules/property-card/property-card-ui";
import useProperties from "@/hooks/queries/useProperties";
import { Property } from "@/types";
import { useRouter } from "expo-router";

export default function PropertiesPage() {
  const router = useRouter();

  const { data, isFetching, fetchNextPage, hasNextPage } = useProperties();

  const properties =
    data?.pages.flatMap((page) => page.data as Property[]) ?? [];

  const handleOnAdd = () => {
    router.push("/properties/add");
  };

  return (
    <MainWrapper
      title="Manage your properties"
      addButtonPressed={handleOnAdd}
      addButtonText="Add Property"
      data={properties}
      hasMore={!!hasNextPage}
      isFetching={isFetching}
      loadMore={fetchNextPage}
      renderItem={({ item }) => <PropertyCard item={item} />}
    />
  );
}
