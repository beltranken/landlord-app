import type { CreateRentData } from "@/api";
import Dropdown from "@/components/atoms/dropdown/dropdown";
import CardSection from "@/components/molecules/card-section/card-section-ui";
import ProgressNavigation from "@/components/organisms/progress-navigation/progress-navigation";
import Sizes from "@/constants/sizes";
import { RentFrequency } from "@/enums";
import { useCreateRent } from "@/hooks/mutations/useCreateRent";
import useProperties from "@/hooks/queries/useProperties";
import { useTenants } from "@/hooks/queries/useTenants";
import { Property, Tenant } from "@/types";
import capitalize from "@/utils/string";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

type CreateRentBody = CreateRentData["body"];

const rentFrequencyOptions = Object.values(RentFrequency).map((type) => ({
  id: type,
  label: capitalize(type),
}));

export default function ContractAddPage() {
  const router = useRouter();
  const createRentMutation = useCreateRent();

  const { data: propertiesData } = useProperties();
  const properties =
    propertiesData?.pages.flatMap((page) => page.data as Property[]) ?? [];

  const { data: tenantsData } = useTenants();
  const tenants: Tenant[] =
    tenantsData?.pages.flatMap((page) => page.data as Tenant[]) ?? [];

  const [form, setForm] = useState<Partial<CreateRentBody>>({
    frequency: RentFrequency.MONTHLY,
    amount: 0,
    gracePeriodDays: 5,
    tenants: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const propertyOptions = properties.map((p) => ({
    id: p.id,
    label: p.name,
  }));

  const tenantOptions = tenants.map((t) => ({
    id: t.id,
    label: `${t.firstName} ${t.lastName}`,
  }));

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.propertyId) newErrors.propertyId = "Property is required";
    if (!form.startDate) newErrors.startDate = "Start date is required";
    if (!form.endDate) newErrors.endDate = "End date is required";
    if (!form.amount || form.amount <= 0)
      newErrors.amount = "Amount must be greater than 0";
    if (!form.nextBillingDate)
      newErrors.nextBillingDate = "Next billing date is required";
    if (!form.tenants || form.tenants.length === 0)
      newErrors.tenants = "At least one tenant is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOnSubmit = () => {
    if (!validate()) return;
    if (createRentMutation.isPending) return;

    createRentMutation.mutate(form as CreateRentBody, {
      onSuccess: (rentId) => {
        router.push(`/contracts/${rentId}`);

        Toast.show({
          type: "success",
          text1: "Contract created",
          text2: "The contract has been created successfully.",
        });
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: "Failed to create contract",
          text2:
            error instanceof Error ? error.message : "Something went wrong",
        });
      },
    });
  };

  return (
    <ProgressNavigation
      titles={["Select Property"]}
      isLoading={createRentMutation.isPending}
      backFallBackUrl="/contracts"
      currrentStep={1}
      totalSteps={3}
    >
      <CardSection title="Property">
        <Dropdown
          placeholder="Select Property"
          label="Property"
          wrapperStyle={styles.formContainer}
          labelStyle={styles.formLabel}
          items={propertyOptions}
          labelKey="label"
          selectedId={form.propertyId}
          onSelect={(item) => {
            setForm((prev) => ({ ...prev, propertyId: Number(item.id) }));
          }}
          errorText={errors.propertyId}
        />
      </CardSection>
    </ProgressNavigation>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: Sizes.padding,
  },
  formLabel: {
    textTransform: "capitalize",
    fontFamily: "Inter-Bold",
  },
  dateRow: {
    flexDirection: "row",
    gap: Sizes.padding,
  },
  dateField: {
    flex: 1,
  },
});
