"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

interface StepperContextValue {
  activeStep: number
  totalSteps: number
  nextStep: () => void
  prevStep: () => void
  setStep: (step: number) => void
  direction: number
}

const StepperContext = React.createContext<StepperContextValue | undefined>(undefined)

export function useStepper() {
  const context = React.useContext(StepperContext)
  if (!context) throw new Error("useStepper must be used within a Stepper")
  return context
}

interface StepperProps {
  children: React.ReactNode
  initialStep?: number
  className?: string
  onStepChange?: (step: number) => void
  steps?: number // New prop to explicitly set total steps
}

export function Stepper({ children, initialStep = 0, className, onStepChange, steps }: StepperProps) {
  const [activeStep, setActiveStep] = React.useState(initialStep)
  const [direction, setDirection] = React.useState(0)

  const totalSteps = steps ?? React.Children.count(children)

  const nextStep = React.useCallback(() => {
    if (activeStep < totalSteps - 1) {
      setDirection(1)
      setActiveStep((prev) => prev + 1)
    }
  }, [activeStep, totalSteps])

  const prevStep = React.useCallback(() => {
    if (activeStep > 0) {
      setDirection(-1)
      setActiveStep((prev) => prev - 1)
    }
  }, [activeStep])

  const setStep = React.useCallback((step: number) => {
    setDirection(step > activeStep ? 1 : -1)
    setActiveStep(step)
  }, [activeStep])

  React.useEffect(() => {
    onStepChange?.(activeStep)
  }, [activeStep, onStepChange])

  const value = React.useMemo(() => ({
    activeStep,
    totalSteps,
    nextStep,
    prevStep,
    setStep,
    direction
  }), [activeStep, totalSteps, nextStep, prevStep, setStep, direction])

  return (
    <StepperContext.Provider value={value}>
      <div className={cn("relative w-full overflow-hidden", className)}>
        {children}
      </div>
    </StepperContext.Provider>
  )
}

interface StepperItemProps {
  step: number
  children: React.ReactNode
  className?: string
}

export function StepperItem({ step, children, className }: StepperItemProps) {
  const { activeStep, direction } = useStepper()

  if (activeStep !== step) return null

  return (
    <motion.div
      key={step}
      initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction > 0 ? "-100%" : "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn("w-full h-full", className)}
    >
      {children}
    </motion.div>
  )
}

interface StepperContentProps {
  children: React.ReactNode
  className?: string
}

export function StepperContent({ children, className }: StepperContentProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {children}
      </AnimatePresence>
    </div>
  )
}

interface StepperTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  step: number
  asChild?: boolean
}

export function StepperTrigger({ step, asChild, className, ...props }: StepperTriggerProps) {
  const { activeStep, setStep } = useStepper()

  const Comp = asChild ? Slot : "button"
  const active = activeStep === step

  return (
    <Comp
      onClick={() => setStep(step)}
      className={cn(
        "px-4 py-2 rounded-lg transition-all",
        active ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:bg-muted",
        className
      )}
      {...props}
    />
  )
}
