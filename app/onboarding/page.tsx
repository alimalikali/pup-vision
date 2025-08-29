"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { OnboardingStep1 } from "@/components/onboarding/step-1"
import { OnboardingStep2 } from "@/components/onboarding/step-2"
import { OnboardingStep3 } from "@/components/onboarding/step-3"
import { OnboardingStep4 } from "@/components/onboarding/step-4"

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    basicInfo: {},
    purpose: {},
    preferences: {},
    photos: {},
  })
  const router = useRouter()

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleNext = (stepData: any) => {
    const stepKey = `step${currentStep}` as keyof typeof formData
    setFormData({ ...formData, [stepKey]: stepData })

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <OnboardingStep1 onNext={handleNext} />
      case 2:
        return <OnboardingStep2 onNext={handleNext} />
      case 3:
        return <OnboardingStep3 onNext={handleNext} />
      case 4:
        return <OnboardingStep4 onNext={handleNext} />
      default:
        return <OnboardingStep1 onNext={handleNext} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Pup</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Let's set up your profile</h1>
          <p className="mt-2 text-muted-foreground">Help us understand you better to find your perfect match</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            {renderStep()}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center bg-transparent"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              <div className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
