import Dropdown from "@/components/atoms/dropdown/dropdown";
import { TextInput } from "@/components/atoms/text-input/text-input";
import { TextInputAmount } from "@/components/atoms/text-input/text-input-amount";
import CardSection from "@/components/molecules/card-section/card-section-ui";
import ImageUpload from "@/components/molecules/image-upload/image-upload";
import InnerWrapper from "@/components/molecules/inner-wrapper/inner-wrapper-ui";
import Sizes from "@/constants/sizes";
import { PropertyType, RentFrequency } from "@/enums";
import { useCreateProperty } from "@/hooks/mutations/useCreateProperty";
import useSubmittedError from "@/hooks/useSubmittedError";
import { CreateProperty, createPropertySchema } from "@/types";
import capitalize from "@/utils/string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

const propertyTypeOptions = Object.values(PropertyType).map((type) => ({
  id: type,
  label: capitalize(type),
}));

const rentFrequencyOptions = Object.values(RentFrequency).map((type) => ({
  id: type,
  label: capitalize(type),
}));

export default function PropertyAddPage() {
  const router = useRouter();
  const createPropertyMutation = useCreateProperty();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<CreateProperty>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: {
      name: "",
      description: "",
      type: PropertyType.APARTMENT,
      defaultRentAmount: 0,
      defaultRentFrequency: RentFrequency.MONTHLY,
      parentId: null,
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Philippines",
    },
  });

  const submittedErrors = useSubmittedError({ errors, isSubmitted });

  const handleOnSubmit = (data: CreateProperty) => {
    if (createPropertyMutation.isPending) return;

    createPropertyMutation.mutate(
      { ...data },
      {
        onSuccess: (propertyId) => {
          router.push(`/properties/${propertyId}`);

          Toast.show({
            type: "success",
            text1: "Property created",
            text2: "The property has been created successfully.",
          });
        },
      },
    );
  };

  return (
    <InnerWrapper
      title="Create New Property"
      onSubmit={handleSubmit(handleOnSubmit)}
      isLoading={createPropertyMutation.isPending}
      submitButtonLabel="Save New Property"
      backButtonLabel="Cancel"
      backFallBackUrl="/properties"
    >
      <Controller
        control={control}
        name="image"
        render={({ field: { onChange, value } }) => (
          <ImageUpload
            label="Property Image"
            image={
              value
                ? {
                    uri: value.uri,
                  }
                : undefined
            }
            onChange={(image) => {
              if (image) {
                onChange({
                  uri: image.uri,
                  name: image.fileName,
                  type: image.mimeType,
                  size: image.fileSize,
                });
              } else {
                onChange(undefined);
              }
            }}
            errorText={
              submittedErrors.image?.type?.message ??
              submittedErrors.image?.name?.message ??
              submittedErrors.image?.size?.message
            }
          />
        )}
      />

      <CardSection>
        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <Dropdown
              placeholder="Select Property Type"
              label="Property Type"
              wrapperStyle={styles.formContainer}
              labelStyle={styles.formLabel}
              items={propertyTypeOptions}
              labelKey="label"
              selectedId={value}
              onSelect={(item) => {
                onChange(item.id);
              }}
              errorText={submittedErrors.type?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="e.g. Sunset Villa"
              wrapperStyle={styles.formContainer}
              label="Property Name"
              labelStyle={styles.formLabel}
              onChangeText={onChange}
              value={value}
              errorText={submittedErrors.name?.message}
            />
          )}
        />
      </CardSection>

      <CardSection title="Default Rent">
        <Controller
          control={control}
          name="defaultRentFrequency"
          render={({ field: { onChange, value } }) => (
            <Dropdown
              placeholder="Select Rent Frequency"
              label="Rent Frequency"
              wrapperStyle={styles.formContainer}
              labelStyle={styles.formLabel}
              items={rentFrequencyOptions}
              labelKey="label"
              selectedId={value}
              onSelect={(item) => {
                onChange(item.id);
              }}
              errorText={submittedErrors.defaultRentFrequency?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="defaultRentAmount"
          render={({ field: { onChange, value } }) => (
            <TextInputAmount
              placeholder="e.g. 1,000"
              wrapperStyle={styles.formContainer}
              label="Default Rent Amount"
              labelStyle={styles.formLabel}
              onChange={onChange}
              value={value}
              errorText={submittedErrors.defaultRentAmount?.message}
            />
          )}
        />
      </CardSection>

      <CardSection title="Address">
        <Controller
          control={control}
          name="address1"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Street address"
              wrapperStyle={styles.formContainer}
              label="Address Line 1"
              labelStyle={styles.formLabel}
              onChangeText={onChange}
              value={value ?? ""}
              errorText={submittedErrors.address1?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="address2"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Apartment, suite, etc. (optional)"
              wrapperStyle={styles.formContainer}
              label="Address Line 2"
              labelStyle={styles.formLabel}
              onChangeText={onChange}
              value={value ?? ""}
              errorText={submittedErrors.address2?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="City"
              wrapperStyle={styles.formContainer}
              label="City"
              labelStyle={styles.formLabel}
              onChangeText={onChange}
              value={value ?? ""}
              errorText={submittedErrors.city?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="state"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="State / Province / Region"
              wrapperStyle={styles.formContainer}
              label="State"
              labelStyle={styles.formLabel}
              onChangeText={onChange}
              value={value ?? ""}
              errorText={submittedErrors.state?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="postalCode"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Postal code"
              wrapperStyle={styles.formContainer}
              label="Postal Code"
              labelStyle={styles.formLabel}
              onChangeText={onChange}
              value={value ?? ""}
              errorText={submittedErrors.postalCode?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="country"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Country"
              wrapperStyle={styles.formContainer}
              label="Country"
              labelStyle={styles.formLabel}
              onChangeText={onChange}
              value={value ?? ""}
              errorText={submittedErrors.country?.message}
            />
          )}
        />
      </CardSection>
    </InnerWrapper>
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
});
