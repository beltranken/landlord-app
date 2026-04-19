import React, { createContext, useContext, useMemo, useState } from "react";

interface StepFormContextValue {
  currentStep: number;
  totalSteps: number;
  setCurrentStep: (step: number) => void;
  setTotalSteps: (total: number) => void;
}

const StepFormContext = createContext<StepFormContextValue | undefined>(
  undefined,
);

export function StepFormProvider({
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

  const value = useMemo(
    () => ({ currentStep, totalSteps, setCurrentStep, setTotalSteps }),
    [currentStep, totalSteps],
  );

  return (
    <StepFormContext.Provider value={value}>
      {children}
    </StepFormContext.Provider>
  );
}

export function useStepForm() {
  const context = useContext(StepFormContext);
  if (!context) {
    throw new Error("useStepForm must be used within a StepFormProvider");
  }
  return context;
}
