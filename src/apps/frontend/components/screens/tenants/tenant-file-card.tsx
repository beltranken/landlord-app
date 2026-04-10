import { TextH5 } from "@/components/atoms/text";
import OverflowActions from "@/components/molecules/overflow-actions/overflow-actions";
import { Colors, Sizes } from "@/constants";
import { TenantFile } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

type Props = {
  file: TenantFile;
};

export default function TenantFileCard({ file }: Props) {
  return (
    <View style={styles.fileContainer}>
      <View style={styles.headerRow}>
        <TextH5>{file.name}</TextH5>

        <OverflowActions
          actions={[
            {
              key: "download",
              label: "Download",
              icon: (
                <MaterialCommunityIcons
                  name="download"
                  size={18}
                  color={Colors.text}
                />
              ),
              onPress: () => {
                // TODO: implement file download
              },
            },
            {
              key: "delete",
              label: "Delete",
              destructive: true,
              icon: (
                <MaterialCommunityIcons
                  name="delete"
                  size={18}
                  color={Colors.textError}
                />
              ),
              onPress: () => {
                // TODO: implement file delete
              },
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fileContainer: {
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    padding: Sizes.padding,
    gap: Sizes.padding,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
