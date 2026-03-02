import React, { useState, ReactNode, useEffect } from "react";
import Button from "./Button";

type FormWizardProps = {
  steps: { label: string; roles: any[]; content: ReactNode }[];
  onFinish: () => void;
  initialStep?: number;
  externalStep?: number;
  onNext?: (proceed: (allow: boolean) => void, currentStep: number) => void;
  onPrevious?: (proceed: (allow: boolean) => void, currentStep: number) => void;
};

const FormWizard: React.FC<FormWizardProps> = ({
  steps,
  onFinish,
  initialStep = 0,
  externalStep,
  onNext,
  onPrevious,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  useEffect(() => {
    if (
      typeof externalStep === "number" &&
      externalStep >= 0 &&
      externalStep < steps.length &&
      externalStep !== currentStep
    ) {
      setCurrentStep(externalStep);
    }
  }, [externalStep, steps.length]);

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    const proceed = (allow: boolean) => {
      if (allow) {
        if (!isLastStep) setCurrentStep((prev) => prev + 1);
        else onFinish();
      }
    };
    if (onNext) {
      onNext(proceed, currentStep);
    } else {
      proceed(true);
    }
  };

  const handleBack = () => {
    const proceed = (allow: boolean) => {
      if (allow && !isFirstStep) setCurrentStep((prev) => prev - 1);
    };
    if (onPrevious) {
      onPrevious(proceed, currentStep);
    } else {
      proceed(true);
    }
  };

  return (
    <div>
      {steps.length > 0 && (
        <>
          <div className="mb-3 flex justify-end space-x-2">
            <Button
              onClick={handleBack}
              size="sm"
              variant="secondary"
              disabled={isFirstStep}
              className={`mr-2 ${
                isFirstStep ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              }`}
            >
              Back
            </Button>
            <Button size="sm" onClick={handleNext}>
              {isLastStep ? "Submit" : "Next"}
            </Button>
          </div>
          <div className="mb-4 flex flex-wrap items-center text-base sm:text-lg">
            {steps.map((step, idx) => (
              <span
                key={step.label}
                className={`mr-2 mb-1 sm:mb-0 ${
                  idx === currentStep
                    ? "font-bold text-primary-600"
                    : "font-normal text-gray-500"
                }`}
              >
                {step.label}
                {idx < steps.length - 1 && (
                  <span className="mx-2 text-gray-400">{">"}</span>
                )}
              </span>
            ))}
          </div>
          <div>{steps[currentStep]?.content}</div>
          <div className="mt-10 flex justify-end space-x-2">
            <Button
              onClick={handleBack}
              variant="secondary"
              disabled={isFirstStep}
              className={`mr-2 ${
                isFirstStep ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              }`}
            >
              Back
            </Button>
            <Button onClick={handleNext}>
              {isLastStep ? "Submit" : "Next"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default FormWizard;
