import type { GetRentsResponse } from "@/api";
import TextSmall from "@/components/atoms/text/text-small-ui";
import { Colors } from "@/constants";
import { View } from "react-native";

type RentStatus = GetRentsResponse["data"][number]["status"];

export default function RentStatusUI({
  status,
}: Readonly<{ status: RentStatus }>) {
  let backgroundColor: string = Colors.neutral;
  let textColor: string = Colors.text;

  switch (status) {
    case "active":
      backgroundColor = "#DCFCE7";
      textColor = "#15803D";
      break;
    case "draft":
      backgroundColor = "#EFF6FF";
      textColor = "#1D4ED8";
      break;
    case "expired":
      backgroundColor = "#FEF3C7";
      textColor = "#92400E";
      break;
    case "terminated":
      backgroundColor = "#FEE2E2";
      textColor = "#B91C1C";
      break;
  }

  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <View
        style={{
          borderRadius: 999,
          backgroundColor,
          paddingVertical: 4,
          paddingHorizontal: 8,
          width: "auto",
        }}
      >
        <TextSmall style={{ color: textColor, textTransform: "capitalize" }}>
          {status}
        </TextSmall>
      </View>
    </View>
  );
}
