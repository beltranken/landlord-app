import ProgressNavigation from "@/components/organisms/progress-navigation/progress-navigation";
import {
  ContractCreationProvider,
  useContractCreation,
} from "@/providers/step-form-provider";
import { Slot } from "expo-router";

function AddContractContent() {
  const { currentStep, totalSteps } = useContractCreation();

  return (
    <ProgressNavigation
      titles={["Select Property", "Select Tenants", "Set Terms"]}
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
    <ContractCreationProvider initialStep={1} initialTotalSteps={3}>
      <AddContractContent />
    </ContractCreationProvider>
  );
}
