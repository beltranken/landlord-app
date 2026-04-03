import { Button } from "@/components/atoms/button";
import { TextH2 } from "@/components/atoms/text";
import ImageUpload from "@/components/molecules/image-upload/image-upload";
import InnerWrapper from "@/components/molecules/inner-wrapper/inner-wrapper-ui";
import PropertyAddressUI from "@/components/molecules/property-card/property-address-ui";
import PropertyStatusUI from "@/components/molecules/property-status/property-status-ui";
import { Colors } from "@/constants";
import Sizes from "@/constants/sizes";
import { PropertyType, RentFrequency } from "@/enums";
import { useProperty } from "@/hooks/useProperty";
import { useUpdateProperty } from "@/hooks/useUpdateProperty";
import { CreateProperty } from "@/types";
import capitalize from "@/utils/string";
import { ImagePickerAsset } from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

const propertyTypeOptions = Object.values(PropertyType).map((type) => ({
  id: type,
  label: capitalize(type),
}));

const rentFrequencyOptions = Object.values(RentFrequency).map((type) => ({
  id: type,
  label: capitalize(type),
}));

export default function PropertyPage() {
  const { id } = useLocalSearchParams();

  const [image, setImage] =
    useState<
      Pick<ImagePickerAsset, "uri" | "fileName" | "mimeType" | "fileSize">
    >();

  const { isLoading, isPending, data: property } = useProperty(Number(id));
  const updateProperty = useUpdateProperty();
  const handleOnSubmit = (data: CreateProperty) => {
    // updateProperty.mutate({ propertyId, body: data });
  };

  useEffect(() => {
    setImage(
      property?.image
        ? {
            uri: property.image,
          }
        : undefined,
    );
  }, [property]);

  if (isPending) {
    return <></>;
  }

  if (property === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TextH2>Property not found</TextH2>
      </View>
    );
  }

  return (
    <InnerWrapper isLoading={isLoading} backFallBackUrl="/properties">
      <View style={{ gap: Sizes.padding * 1.5 }}>
        <ImageUpload image={image} onChange={setImage} />

        <View style={{ gap: Sizes.padding / 2 }}>
          <View
            style={{
              flexDirection: "row",
              gap: Sizes.padding,
              flexWrap: "wrap",
            }}
          >
            <TextH2>{property.name}</TextH2>

            <PropertyStatusUI status={property.status} />
          </View>

          <PropertyAddressUI property={property} />
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: Sizes.padding,
            justifyContent: "space-evenly",
          }}
        >
          <Button containerStyle={{ width: "auto" }} style={{ width: "auto" }}>
            Edit details
          </Button>

          <Button
            containerStyle={{
              width: "auto",
            }}
            style={{
              backgroundColor: Colors.buttonSecondary,
              borderWidth: 1,
              borderColor: Colors.inputBorder,
            }}
            textStyles={{ color: Colors.secondary }}
          >
            View contracts
          </Button>
        </View>
      </View>
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
