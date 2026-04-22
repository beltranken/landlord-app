import { Button } from "@/components/atoms/button";
import { Text } from "@/components/atoms/text";
import { BaseStyles, Colors, Sizes } from "@/constants";
import { AntDesign } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

type ContractStepNextActionProps = {
  disabled?: boolean;
  onPress?: () => void;
  label?: string;
  errorMessage?: string;
};

export default function ContractStepNextAction({
  disabled,
  onPress,
  label = "Next Step",
  errorMessage,
}: Readonly<ContractStepNextActionProps>) {
  return (
    <View style={BaseStyles.wrapper}>
      <View style={styles.actionContainer}>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <Button
          style={styles.nextBtn}
          containerStyle={{ width: "100%" }}
          disabled={disabled}
          onPress={onPress}
        >
          <Text style={styles.nextBtnText}>{label}</Text>

          <AntDesign name="arrow-right" size={20} color="white" />
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionContainer: {
    backgroundColor: Colors.white,
    padding: Sizes.padding,
    width: "100%",
    gap: 8,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
  nextBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  nextBtnText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },
});
