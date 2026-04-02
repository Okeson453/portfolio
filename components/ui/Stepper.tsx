'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: StepConfig[];
  onStepChange?: (stepIndex: number) => void;
  currentStep?: number;
}

interface StepConfig {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function Stepper({
  steps,
  onStepChange,
  currentStep: controlledStep,
}: StepperProps) {
  const [internalStep, setInternalStep] = useState(0);
  const currentStep = controlledStep !== undefined ? controlledStep : internalStep;

  const handleStepClick = (index: number) => {
    if (index <= currentStep) {
      setInternalStep(index);
      onStepChange?.(index);
    }
  };

  return (
    <div className="space-y-8">
      {/* Step indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step */}
            <button
              onClick={() => handleStepClick(index)}
              className="flex flex-col items-center gap-2 flex-1"
              disabled={index > currentStep}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  'font-semibold text-sm transition-all',
                  index < currentStep
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                      ? 'bg-blue-500 text-white ring-4 ring-blue-500/30'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                )}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  'text-sm font-medium hidden sm:block',
                  index <= currentStep
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                )}
              >
                {step.title}
              </span>
            </button>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'h-1 flex-1 mx-2 transition-all',
                  index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <div className="min-h-[200px]">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {steps[currentStep].title}
          </h2>
          {steps[currentStep].description && (
            <p className="text-gray-600 dark:text-gray-400">
              {steps[currentStep].description}
            </p>
          )}
        </div>
      </div>

      {/* Step counter */}
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Step {currentStep + 1} of {steps.length}
      </p>
    </div>
  );
}
