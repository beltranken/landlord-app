import { Button } from "@/components/atoms/button";
import { TextH2 } from "@/components/atoms/text";
import CardSection from "@/components/molecules/card-section/card-section-ui";
import ImageUpload from "@/components/molecules/image-upload/image-upload";
import InnerWrapper from "@/components/molecules/inner-wrapper/inner-wrapper-ui";
import NotFound from "@/components/molecules/not-found/not-found-ui";
import PropertyAddressUI from "@/components/molecules/property-card/property-address-ui";
import PropertyFeatureField from "@/components/molecules/property-feature/property-feature-field";
import PropertyStatusUI from "@/components/molecules/property-status/property-status-ui";
import { Colors } from "@/constants";
import Sizes from "@/constants/sizes";
import { PropertyFeatureTypes } from "@/enums";
import { useProperty } from "@/hooks/queries/useProperty";
import { ImagePickerAsset } from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function PropertyPage() {
  const { id } = useLocalSearchParams();

  const [image, setImage] =
    useState<
      Pick<ImagePickerAsset, "uri" | "fileName" | "mimeType" | "fileSize">
    >();

  const { isLoading, isPending, data: property } = useProperty(Number(id));

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
    return <NotFound message="Property not found" />;
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

        <CardSection title="Features">
          {property.features && property.features.length > 0 ? (
            property.features.map((feature) => (
              <PropertyFeatureField
                key={feature.id}
                feature={{
                  ...feature,
                  featureType: feature.featureType
                    ? {
                        ...feature.featureType,
                        type: feature.featureType.type as PropertyFeatureTypes,
                      }
                    : undefined,
                }}
              />
            ))
          ) : (
            <View>
              <TextH2>No features available</TextH2>
            </View>
          )}
        </CardSection>
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
