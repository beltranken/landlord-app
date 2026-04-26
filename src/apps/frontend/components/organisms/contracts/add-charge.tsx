import { Button } from "@/components/atoms/button";
import Dropdown from "@/components/atoms/dropdown/dropdown";
import { TextArea } from "@/components/atoms/text-area/text-area";
import { TextInputAmount } from "@/components/atoms/text-input/text-input-amount";
import { Sizes } from "@/constants";
import useSubmittedError from "@/hooks/useSubmittedError";
import {
  ChargeFrequency,
  CreateRentCharge,
  createRentChargeSchema,
} from "@/types";
import { getBillingCycleOptionsForChargeFrequency } from "@/utils/billing-cycle-options";
import { CHARGE_FREQUENCY_OPTIONS } from "@/utils/charge-frequency-options";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import Popup from "../popup/popup";

interface AddChargeProps {
  onSubmit: (data: CreateRentCharge) => void;
  visible: boolean;
  onClose: () => void;
}

export default function AddCharge({
  onSubmit,
  visible,
  onClose,
}: AddChargeProps) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<CreateRentCharge>({
    resolver: zodResolver(createRentChargeSchema),
    defaultValues: {
      frequency: ChargeFrequency.MONTHLY,
      amount: 0,
      description: "",
      billingCycleAnchor: 1,
    },
  });

  const submittedErrors = useSubmittedError({ errors, isSubmitted });

  const watchedFrequency = watch("frequency");
  const billingCycleOptions =
    getBillingCycleOptionsForChargeFrequency(watchedFrequency);

  useEffect(() => {
    setValue("billingCycleAnchor", 1);
  }, [watchedFrequency, setValue]);

  return (
    <Popup visible={visible} title="Add Charge" onClose={onClose}>
      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="frequency"
          render={({ field: { value, onChange } }) => (
            <Dropdown
              label="Frequency"
              labelKey="label"
              items={CHARGE_FREQUENCY_OPTIONS}
              selectedId={value}
              onSelect={(value) => {
                onChange(value.id);
              }}
              errorText={submittedErrors.frequency?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="amount"
          render={({ field: { value, onChange } }) => (
            <TextInputAmount
              label={`Amount`}
              value={value}
              onChange={onChange}
              placeholder="Amount"
              errorText={submittedErrors.amount?.message}
            />
          )}
        />

        {watchedFrequency !== ChargeFrequency.ONE_TIME && (
          <Controller
            control={control}
            name="billingCycleAnchor"
            render={({ field: { value, onChange } }) => (
              <Dropdown
                label="Billing cycle"
                labelKey="label"
                items={billingCycleOptions}
                placeholder="Select billing cycle"
                selectedId={value ?? undefined}
                onSelect={(selectedOption) => {
                  onChange(selectedOption.id);
                }}
                errorText={submittedErrors.billingCycleAnchor?.message}
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange } }) => (
            <TextArea
              value={value ?? ""}
              onChangeText={onChange}
              placeholder="Description"
              errorText={submittedErrors.description?.message}
            />
          )}
        />

        <Button onPress={handleSubmit(onSubmit)}>Add Charge</Button>
      </View>
    </Popup>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: Sizes.padding,
    paddingVertical: Sizes.padding * 2,
  },
});
