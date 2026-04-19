import ProgressNavigation from "@/components/organisms/progress-navigation/progress-navigation";
import { StepFormProvider, useStepForm } from "@/providers/step-form-provider";
import { Slot } from "expo-router";

function AddContractContent() {
  const { currentStep, totalSteps } = useStepForm();

  return (
    <ProgressNavigation
      titles={["Select Property"]}
      currrentStep={currentStep}
      totalSteps={totalSteps}
      isLoading={false}
    >
      <Slot />
    </ProgressNavigation>
  );
}

export default function AddContractLayout() {
  return (
    <StepFormProvider initialStep={1} initialTotalSteps={3}>
      <AddContractContent />
    </StepFormProvider>
  );
}
