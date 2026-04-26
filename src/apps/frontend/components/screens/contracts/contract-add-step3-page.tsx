import type { CreateRentData } from "@/api";
import Checkbox from "@/components/atoms/checkbox/checkbox";
import Dropdown from "@/components/atoms/dropdown/dropdown";
import { TextInputAmount } from "@/components/atoms/text-input/text-input-amount";
import CardSection from "@/components/molecules/card-section/card-section-ui";
import DateInput from "@/components/molecules/date-input/date-input";
import ContractChargePreviewList from "@/components/screens/contracts/contract-charge-preview-list";
import ContractStepNextAction from "@/components/screens/contracts/contract-step-next-action";
import { BaseStyles, Sizes } from "@/constants";
import { RentFrequency } from "@/enums";
import useSubmittedError from "@/hooks/useSubmittedError";
import { useContractCreation } from "@/providers/step-form-provider";
import {
  CreateRentCharge,
  CreateRentStep3,
  createRentStep3Schema,
} from "@/types";
import { getBillingCycleOptionsForRentFrequency } from "@/utils/billing-cycle-options";
import capitalize from "@/utils/string";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";

type CreateRentBody = CreateRentData["body"];

const rentFrequencyOptions = Object.values(RentFrequency).map((type) => ({
  id: type,
  label: capitalize(type),
}));

export default function AddContractStep3Page() {
  const router = useRouter();
  const { draftContract, setStep3Data } = useContractCreation();

  const today = dayjs(new Date());

  const {
    control,
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<CreateRentStep3>({
    resolver: zodResolver(createRentStep3Schema),
    defaultValues: {
      frequency: RentFrequency.MONTHLY,
      amount: 0,
      billingCycleAnchor: 1,
      firstBillingDate: today.add(1, "month").toDate(),
      startDate: today.toDate(),
      endDate: today.add(1, "year").toDate(),
      autoRenew: true,
      charges: [],
    },
  });

  const {
    fields: charges,
    append: appendCharge,
    remove: removeCharge,
  } = useFieldArray({
    control,
    name: "charges",
  });

  const submittedErrors = useSubmittedError({ errors, isSubmitted });

  const watchedFrequency = watch("frequency");
  const watchedStartDate = watch("startDate");
  const watchedEndDate = watch("endDate");

  const billingCycleOptions = getBillingCycleOptionsForRentFrequency(
    watchedFrequency ?? RentFrequency.MONTHLY,
  );

  const handleOnAddCharge = (charge: CreateRentCharge) => {
    appendCharge(charge);
  };

  const handleOnRemoveCharge = (index: number) => {
    removeCharge(index);
  };

  const handleOnSubmit = () => {};

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={BaseStyles.wrapper}>
          <View style={BaseStyles.container}>
            <CardSection title="Rent Terms">
              <Controller
                control={control}
                name="frequency"
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label="Rent frequency"
                    labelStyle={styles.fieldLabel}
                    items={rentFrequencyOptions}
                    labelKey="label"
                    selectedId={value}
                    onSelect={(item) => onChange(item.id)}
                  />
                )}
              />

              <Controller
                control={control}
                name="amount"
                render={({ field: { value, onChange } }) => (
                  <TextInputAmount
                    label="Rent amount"
                    labelStyle={styles.fieldLabel}
                    placeholder="Enter rent amount"
                    value={value}
                    onChange={onChange}
                    errorText={submittedErrors.amount?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="billingCycleAnchor"
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label="Billing Cycle Anchor"
                    labelStyle={styles.fieldLabel}
                    items={billingCycleOptions}
                    labelKey="label"
                    selectedId={value ?? 1}
                    onSelect={(item) => onChange(item.id)}
                  />
                )}
              />

              <Controller
                control={control}
                name="firstBillingDate"
                render={({ field: { value, onChange } }) => (
                  <DateInput
                    label="Bill Start Date"
                    labelStyle={styles.fieldLabel}
                    value={value}
                    onChange={onChange}
                    error={submittedErrors.firstBillingDate?.message}
                  />
                )}
              />
            </CardSection>

            <CardSection title="Contract Terms">
              <Controller
                control={control}
                name="startDate"
                render={({ field: { value, onChange } }) => (
                  <DateInput
                    label="Start Date"
                    labelStyle={styles.fieldLabel}
                    value={value}
                    onChange={(date) => {
                      onChange(date);

                      const nextStartDate = dayjs(date);
                      const currentEndDate = watchedEndDate
                        ? dayjs(watchedEndDate)
                        : null;

                      if (currentEndDate?.isBefore(nextStartDate, "day")) {
                        setValue(
                          "endDate",
                          nextStartDate.add(1, "year").toDate(),
                          {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          },
                        );
                      }
                    }}
                    error={submittedErrors.startDate?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="endDate"
                render={({ field: { value, onChange } }) => (
                  <DateInput
                    label="End Date"
                    labelStyle={styles.fieldLabel}
                    value={value}
                    onChange={onChange}
                    minDate={watchedStartDate ?? undefined}
                    error={submittedErrors.endDate?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="autoRenew"
                render={({ field: { value, onChange } }) => (
                  <Checkbox
                    checked={value ?? false}
                    label="Auto Renew"
                    onPress={() => {
                      onChange(!value);
                    }}
                  />
                )}
              />
            </CardSection>

            <CardSection title="Additional Charges">
              <ContractChargePreviewList
                charges={charges}
                onAddCharge={handleOnAddCharge}
                onRemoveCharge={handleOnRemoveCharge}
              />
            </CardSection>
          </View>
        </View>
      </ScrollView>

      <ContractStepNextAction onPress={handleOnSubmit} />
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
});
