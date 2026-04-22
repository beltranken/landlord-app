import type { CreateRentData } from "@/api";
import { Button } from "@/components/atoms/button";
import Dropdown from "@/components/atoms/dropdown/dropdown";
import { Text } from "@/components/atoms/text";
import { TextInput } from "@/components/atoms/text-input/text-input";
import { TextInputAmount } from "@/components/atoms/text-input/text-input-amount";
import CardSection from "@/components/molecules/card-section/card-section-ui";
import ContractStepNextAction from "@/components/screens/contracts/contract-step-next-action";
import { BaseStyles, Colors, Sizes } from "@/constants";
import { RentFrequency } from "@/enums";
import { useCreateRent } from "@/hooks/mutations/useCreateRent";
import {
  DraftContractCharge,
  useContractCreation,
} from "@/providers/step-form-provider";
import capitalize from "@/utils/string";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

type CreateRentBody = CreateRentData["body"];

const rentFrequencyOptions = Object.values(RentFrequency).map((type) => ({
  id: type,
  label: capitalize(type),
}));

export default function AddContractStep3Page() {
  const router = useRouter();
  const createRentMutation = useCreateRent();
  const { draftContract, setStep3Data } = useContractCreation();

  const [frequency, setFrequency] = useState<RentFrequency>(
    draftContract.step3?.frequency ?? RentFrequency.MONTHLY,
  );
  const [amount, setAmount] = useState<number>(
    draftContract.step3?.amount ?? 0,
  );
  const [charges, setCharges] = useState<DraftContractCharge[]>(
    draftContract.step3?.charges ?? [],
  );
  const [chargeDescription, setChargeDescription] = useState("");
  const [chargeAmount, setChargeAmount] = useState(0);
  const [errors, setErrors] = useState<{
    amount?: string;
    charge?: string;
    submit?: string;
  }>({});

  useEffect(() => {
    setStep3Data({
      frequency,
      amount,
      charges,
    });
  }, [amount, charges, frequency, setStep3Data]);

  const selectedTenants = draftContract.step2 ?? [];
  const property = draftContract.step1;

  const canSubmit = !!property && amount > 0 && selectedTenants.length > 0;

  const chargePreview = useMemo(() => {
    return charges.map((charge, index) => ({
      ...charge,
      id: `${charge.description}-${index}`,
    }));
  }, [charges]);

  const handleOnAddCharge = () => {
    if (!chargeDescription.trim() || chargeAmount <= 0) {
      setErrors((prev) => ({
        ...prev,
        charge: "Enter a charge name and amount before adding it.",
      }));
      return;
    }

    setCharges((prev) => [
      ...prev,
      {
        description: chargeDescription.trim(),
        amount: chargeAmount,
        isRecurring: false,
      },
    ]);
    setChargeDescription("");
    setChargeAmount(0);
    setErrors((prev) => ({ ...prev, charge: undefined }));
  };

  const handleOnRemoveCharge = (index: number) => {
    setCharges((prev) =>
      prev.filter((_, chargeIndex) => chargeIndex !== index),
    );
  };

  const handleOnSubmit = () => {
    const nextErrors: typeof errors = {};

    if (amount <= 0) {
      nextErrors.amount = "Rent amount must be greater than 0.";
    }

    if (!property) {
      nextErrors.submit = "Property selection is missing. Return to step 1.";
    }

    if (selectedTenants.length === 0) {
      nextErrors.submit = "Tenant selection is missing. Return to step 2.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || createRentMutation.isPending) {
      return;
    }

    const body: CreateRentBody = {
      propertyId: property!.id,
      frequency,
      amount,
      gracePeriodDays: 5,
      tenants: selectedTenants.map((entry) => ({
        tenantId: entry.tenant.id,
        isPrimary: entry.isPrimary,
      })),
    };

    createRentMutation.mutate(body, {
      onSuccess: (rentId) => {
        router.replace(`/contracts/${rentId}`);
        Toast.show({
          type: "success",
          text1: "Contract created",
          text2: "The contract has been created successfully.",
        });
      },
      onError: (error) => {
        const message =
          error instanceof Error ? error.message : "Something went wrong";

        setErrors((prev) => ({ ...prev, submit: message }));
        Toast.show({
          type: "error",
          text1: "Failed to create contract",
          text2: message,
        });
      },
    });
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={BaseStyles.wrapper}>
          <View style={BaseStyles.container}>
            <CardSection title="Rent Terms">
              <Dropdown
                label="Rent frequency"
                labelStyle={styles.fieldLabel}
                items={rentFrequencyOptions}
                labelKey="label"
                selectedId={frequency}
                onSelect={(item) => setFrequency(item.id as RentFrequency)}
              />

              <TextInputAmount
                label="Rent amount"
                labelStyle={styles.fieldLabel}
                placeholder="Enter rent amount"
                value={amount}
                onChange={setAmount}
                errorText={errors.amount}
              />
            </CardSection>

            <CardSection title="Additional Charges">
              <TextInput
                label="Charge name"
                labelStyle={styles.fieldLabel}
                placeholder="Downpayment"
                value={chargeDescription}
                onChangeText={setChargeDescription}
              />

              <TextInputAmount
                label="Charge amount"
                labelStyle={styles.fieldLabel}
                placeholder="Enter charge amount"
                value={chargeAmount}
                onChange={setChargeAmount}
                errorText={errors.charge}
              />

              <Button
                style={styles.addChargeButton}
                onPress={handleOnAddCharge}
              >
                Add Charge
              </Button>

              {chargePreview.length > 0 ? (
                <View style={styles.chargeList}>
                  {chargePreview.map((charge, index) => (
                    <View key={charge.id} style={styles.chargeItem}>
                      <View style={styles.chargeCopy}>
                        <Text style={styles.chargeTitle}>
                          {charge.description}
                        </Text>
                        <Text style={styles.chargeAmount}>
                          ${charge.amount}
                        </Text>
                      </View>

                      <Pressable
                        style={styles.chargeDeleteButton}
                        onPress={() => handleOnRemoveCharge(index)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color={Colors.danger}
                        />
                      </Pressable>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.helperText}>
                  Add one-off charges like downpayment or setup fees.
                </Text>
              )}
            </CardSection>
          </View>
        </View>
      </ScrollView>

      <ContractStepNextAction
        disabled={!canSubmit || createRentMutation.isPending}
        label={createRentMutation.isPending ? "Creating..." : "Create Contract"}
        errorMessage={errors.submit}
        onPress={handleOnSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingVertical: Sizes.padding,
  },
  fieldLabel: {
    fontFamily: "Inter-Bold",
    textTransform: "capitalize",
  },
  addChargeButton: {
    justifyContent: "center",
  },
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
