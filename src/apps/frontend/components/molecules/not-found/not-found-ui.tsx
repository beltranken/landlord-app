import { TextH2 } from "@/components/atoms/text";
import { StyleSheet, View } from "react-native";

type Props = {
  message?: string;
};

export default function NotFound({ message = "Not found" }: Props) {
  return (
    <View style={styles.container}>
      <TextH2>{message}</TextH2>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
