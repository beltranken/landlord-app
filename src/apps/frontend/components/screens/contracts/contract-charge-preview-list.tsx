import { Button } from "@/components/atoms/button";
import { Text } from "@/components/atoms/text";
import AddCharge from "@/components/organisms/contracts/add-charge";
import { Colors, Sizes } from "@/constants";
import { CreateRentCharge } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type ContractChargePreviewListProps = {
  charges: CreateRentCharge[];
  onAddCharge: (charge: CreateRentCharge) => void;
  onRemoveCharge: (index: number) => void;
};

export default function ContractChargePreviewList({
  charges,
  onAddCharge,
  onRemoveCharge,
}: ContractChargePreviewListProps) {
  const [isAdding, setIsAdding] = useState(false);

  let InnerComp;
  if (charges.length === 0) {
    InnerComp = (
      <Text style={styles.helperText}>
        Add one-off charges like downpayment or setup fees.
      </Text>
    );
  } else {
    InnerComp = (
      <>
        {charges.map((charge, index) => (
          <View
            key={`${charge.description}-${index}`}
            style={styles.chargeItem}
          >
            <View style={styles.chargeCopy}>
              <Text style={styles.chargeTitle}>{charge.description}</Text>
              <Text style={styles.chargeAmount}>${charge.amount}</Text>
            </View>

            <Pressable
              style={styles.chargeDeleteButton}
              onPress={() => onRemoveCharge(index)}
            >
              <Ionicons name="trash-outline" size={18} color={Colors.danger} />
            </Pressable>
          </View>
        ))}
      </>
    );
  }

  return (
    <View style={styles.chargeList}>
      {InnerComp}

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Button
          onPress={() => {
            console.log("KEEE");
            setIsAdding(true);
          }}
        >
          Add Charge
        </Button>
      </View>

      <AddCharge
        visible={isAdding}
        onSubmit={(charge) => {
          setIsAdding(false);
          onAddCharge(charge);
        }}
        onClose={() => {
          setIsAdding(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chargeList: {
    gap: 12,
  },
  chargeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Sizes.padding,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.white,
  },
  chargeCopy: {
    gap: 4,
  },
  chargeTitle: {
    fontFamily: "Inter-SemiBold",
    color: Colors.textTitle,
  },
  chargeAmount: {
    color: Colors.text,
  },
  chargeDeleteButton: {
    padding: 4,
  },
  helperText: {
    color: Colors.text,
  },
});
