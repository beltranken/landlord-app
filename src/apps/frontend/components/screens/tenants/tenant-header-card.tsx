import { GetTenantResponse } from "@/api/types.gen";
import { Button } from "@/components/atoms/button";
import { Text, TextH2 } from "@/components/atoms/text";
import CardSection from "@/components/molecules/card-section/card-section-ui";
import { Colors, Sizes } from "@/constants";
import formatFullName from "@/utils/format-full-name";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
  tenant: GetTenantResponse["data"];
};

export default function TenantHeaderCard({ tenant }: Props) {
  return (
    <CardSection>
      <View style={styles.nameContainer}>
        <TextH2>{formatFullName(tenant)}</TextH2>

        <View style={styles.actionContainer}>
          <Pressable style={styles.actionBtn}>
            <MaterialCommunityIcons
              name="pencil-outline"
              size={20}
              color={Colors.text}
            />
          </Pressable>

          <Pressable style={styles.actionBtn}>
            <MaterialCommunityIcons
              name="delete-outline"
              size={20}
              color={Colors.textError}
            />
          </Pressable>
        </View>
      </View>

      <View>
        {tenant.email && (
          <View style={styles.detailsContainer}>
            <MaterialCommunityIcons name="email-outline" size={12} />

            <Text>{tenant.email}</Text>
          </View>
        )}

        {tenant.phone && (
          <View style={styles.detailsContainer}>
            <MaterialCommunityIcons name="phone-outline" size={12} />

            <Text>{tenant.phone}</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          containerStyle={styles.primaryButtonContainer}
          style={styles.primaryButton}
        >
          <MaterialCommunityIcons
            name="email-outline"
            size={16}
            color="white"
          />

          <Text style={styles.primaryButtonText}>Send email</Text>
        </Button>

        <Button
          containerStyle={styles.secondaryButtonContainer}
          style={styles.secondaryButton}
        >
          <MaterialCommunityIcons
            name="phone-outline"
            size={16}
            color={Colors.text}
          />

          <Text style={styles.secondaryButtonText}>Call</Text>
        </Button>
      </View>
    </CardSection>
  );
}

const styles = StyleSheet.create({
  nameContainer: {
    gap: Sizes.padding / 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionContainer: {
    flexDirection: "row",
    gap: 2,
    justifyContent: "flex-end",
  },
  actionBtn: {
    borderRadius: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: Sizes.padding,
  },
  primaryButtonContainer: {
    width: "auto",
    alignItems: "center",
    gap: 4,
  },
  primaryButton: {
    width: "auto",
    flexDirection: "row",
    gap: Sizes.padding / 3,
    paddingVertical: Sizes.padding * 0.75,
    paddingHorizontal: Sizes.padding * 1.25,
  },
  primaryButtonText: {
    color: Colors.buttonText,
    fontFamily: "Inter-SemiBold",
  },
  secondaryButtonContainer: {
    width: "auto",
    alignItems: "center",
    gap: 4,
  },
  secondaryButton: {
    width: "auto",
    flexDirection: "row",
    gap: Sizes.padding / 3,
    paddingVertical: Sizes.padding * 0.75,
    paddingHorizontal: Sizes.padding * 1.25,
    backgroundColor: Colors.buttonSecondary,
  },
  secondaryButtonText: {
    color: Colors.text,
    fontFamily: "Inter-SemiBold",
  },
});
