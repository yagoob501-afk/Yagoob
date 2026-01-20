"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"
import Joyride, { STATUS } from "react-joyride"
import type { CallBackProps, Step, Styles } from "react-joyride"

interface TourContextType {
  startTour: (steps: Step[]) => void
  isOpen: boolean
  closeTour: () => void
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export function useTour() {
  const context = useContext(TourContext)
  if (!context) {
    throw new Error("useTour must be used within a TourProvider")
  }
  return context
}

export default function TourProvider({ children }: { children: ReactNode }) {
  const [run, setRun] = useState(false)
  const [steps, setSteps] = useState<Step[]>([])
  const [stepIndex, setStepIndex] = useState(0)

  const startTour = (newSteps: Step[]) => {
    setSteps(newSteps)
    setStepIndex(0)
    setRun(true)
  }

  const closeTour = () => {
    setRun(false)
    setStepIndex(0)
  }

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index, action } = data

    // Update local step index state to keep track
    if (type === 'step:after' || type === 'error:target_not_found') {
      const nextIndex = index + (action === 'prev' ? -1 : 1);
      setStepIndex(nextIndex);
    }

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      setRun(false)
      setStepIndex(0)
    }
  }

  // Handle autoNextOnClick
  useEffect(() => {
    if (!run || !steps[stepIndex]) return;

    const currentStep = steps[stepIndex] as (Step & { autoNextOnClick?: boolean });

    if (currentStep.autoNextOnClick && typeof currentStep.target === 'string') {
      const targetElement = document.querySelector(currentStep.target);

      if (targetElement) {
        const handleNext = () => {
          setTimeout(() => {
            setStepIndex(prev => prev + 1);
          }, 300);
        };

        targetElement.addEventListener('click', handleNext, { once: true });

        return () => {
          targetElement.removeEventListener('click', handleNext);
        };
      }
    }
  }, [run, stepIndex, steps]);

  // Custom styles for a polished look
  const styles: Styles = {
    options: {
      zIndex: 10000,
      primaryColor: '#10B981', // Emerald-500
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      arrowColor: '#ffffff',
    },
    buttonNext: {
      backgroundColor: '#10B981',
      fontSize: '14px',
      padding: '8px 16px',
      borderRadius: '8px',
      fontWeight: 'bold',
      fontFamily: 'inherit',
    },
    buttonBack: {
      color: '#6b7280',
      fontSize: '14px',
      marginRight: '10px',
      fontFamily: 'inherit',
    },
    buttonSkip: {
      color: '#EF4444',
      fontSize: '14px',
      fontFamily: 'inherit',
    },
    tooltip: {
      borderRadius: '16px',
      padding: '16px',
      fontFamily: 'inherit',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    tooltipContent: {
      padding: '10px 0',
      lineHeight: '1.6',
      fontSize: '15px'
    }
  } as Styles

  return (
    <TourContext.Provider value={{ startTour, isOpen: run, closeTour }}>
      <Joyride
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        continuous
        showSkipButton
        showProgress
        scrollToFirstStep
        disableScrolling={false} // Allow scrolling to elements
        scrollOffset={100}
        styles={styles}
        locale={{
          back: 'السابق',
          close: 'إغلاق',
          last: 'إنهاء',
          next: 'التالي',
          open: 'افتح الحوار',
          skip: 'تخطي',
        }}
        callback={handleJoyrideCallback}
      />
      {children}
    </TourContext.Provider>
  )
}
