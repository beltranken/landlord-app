import { RentFrequency } from "@/enums";
import React, { createContext, useContext, useMemo, useState } from "react";
import { GetPropertyResponse, GetTenantResponse } from "../api";

type DraftContractStep1 = GetPropertyResponse["data"];
type DraftContractStep2 = {
  tenant: GetTenantResponse["data"];
  isPrimary: boolean;
};
export type DraftContractCharge = {
  description: string;
  amount: number;
  isRecurring: boolean;
};

export type DraftContractStep3 = {
  frequency: RentFrequency;
  amount: number;
  charges: DraftContractCharge[];
};

interface DraftContract {
  step1?: DraftContractStep1;
  step2?: DraftContractStep2[];
  step3?: DraftContractStep3;
}

interface StepFormContextValue {
  currentStep: number;
  totalSteps: number;
  setCurrentStep: (step: number) => void;
  setTotalSteps: (total: number) => void;

  draftContract: DraftContract;
  setStep1Data: (data: DraftContractStep1) => void;
  setStep2Data: (data: DraftContractStep2[]) => void;
  setStep3Data: (data: DraftContractStep3) => void;
}

const StepFormContext = createContext<StepFormContextValue | undefined>(
  undefined,
);

export function ContractCreationProvider({
  initialStep = 1,
  initialTotalSteps = 1,
  children,
}: Readonly<{
  initialStep?: number;
  initialTotalSteps?: number;
  children: React.ReactNode;
}>) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [totalSteps, setTotalSteps] = useState(initialTotalSteps);

  const [draftContract, setDraftContract] = useState<DraftContract>({});

  const handleOnStep1Data = (data: DraftContractStep1) => {
    setDraftContract((prev) => ({ ...prev, step1: data }));
  };

  const handleOnStep2Data = (data: DraftContractStep2[]) => {
    setDraftContract((prev) => ({ ...prev, step2: data }));
  };

  const handleOnStep3Data = (data: DraftContractStep3) => {
    setDraftContract((prev) => ({ ...prev, step3: data }));
  };

  const value = useMemo(
    () => ({
      currentStep,
      totalSteps,
      draftContract,
      setStep1Data: handleOnStep1Data,
      setStep2Data: handleOnStep2Data,
      setStep3Data: handleOnStep3Data,
      setCurrentStep,
      setTotalSteps,
    }),
    [currentStep, totalSteps, draftContract],
  );

  return (
    <StepFormContext.Provider value={value}>
      {children}
    </StepFormContext.Provider>
  );
}

export function useContractCreation() {
  const context = useContext(StepFormContext);
  if (!context) {
    throw new Error(
      "useContractCreation must be used within a ContractCreationProvider",
    );
  }
  return context;
}
