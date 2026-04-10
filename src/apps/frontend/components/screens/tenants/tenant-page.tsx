import { TextH2 } from "@/components/atoms/text";
import CardSection from "@/components/molecules/card-section/card-section-ui";
import InnerWrapper from "@/components/molecules/inner-wrapper/inner-wrapper-ui";
import NotFound from "@/components/molecules/not-found/not-found-ui";
import { useTenant } from "@/hooks/queries/useTenant";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import TenantFileCard from "./tenant-file-card";
import TenantHeaderCard from "./tenant-header-card";
import TenantRentsSection from "./tenant-rents-section";

export default function TenantPage() {
  const { id } = useLocalSearchParams();

  const { isLoading, isPending, data: tenant } = useTenant(Number(id));

  if (isPending) {
    return <></>;
  }

  if (tenant === undefined) {
    return <NotFound message="Property not found" />;
  }

  return (
    <InnerWrapper isLoading={isLoading}>
      <TenantHeaderCard tenant={tenant} />

      <CardSection>
        <TenantRentsSection tenantId={Number(id)} />
      </CardSection>

      <CardSection>
        <TextH2>Active Maintenance</TextH2>
      </CardSection>

      <CardSection>
        <TextH2>Payment History</TextH2>
      </CardSection>

      <CardSection>
        <TextH2>Documents</TextH2>

        {tenant.files?.map((file) => (
          <TenantFileCard key={file.id} file={file} />
        ))}
      </CardSection>
    </InnerWrapper>
  );
}

const styles = StyleSheet.create({
  notFoundContainer: {},
});
