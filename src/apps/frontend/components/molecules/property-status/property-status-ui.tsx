import TextSmall from "@/components/atoms/text/text-small-ui";
import { PropertyStatus } from "@shared/db";
import { View } from "react-native";

export default function PropertyStatusUI({
  status,
}: Readonly<{ status: PropertyStatus }>) {
  let backgroundColor = "#FFF5F5";
  let textColor = "#DC2626";

  if (status !== "occupied") {
    backgroundColor = "#DCFCE7";
    textColor = "#15803D";
  }

  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <View
        style={{
          borderRadius: 100,
          backgroundColor,
          paddingVertical: 4,
          paddingHorizontal: 8,
          width: "auto",
        }}
      >
        <TextSmall style={{ color: textColor }}>{status}</TextSmall>
      </View>
    </View>
  );
}
