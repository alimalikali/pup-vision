'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { DynamicForm } from '@/components/feature/onboarding/dynamic-form';
import { useAuthStore } from '@/store';
import { onboardingService } from '@/services';
import Image from 'next/image';
import { Profile } from '@types';

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  verified: boolean;
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateUser } = useAuthStore();

  // Check for Google user data in URL params
  useEffect(() => {
    const googleUserParam = searchParams.get('google_user');
    console.log('[v0] Google user param:', googleUserParam);

    if (googleUserParam) {
      try {
        const userData = JSON.parse(googleUserParam);
        console.log('[v0] Parsed Google user data:', userData);
        setGoogleUser(userData);

        // Pre-fill form data with Google user information
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          // You can add more pre-filled fields here
        });

        // Clean up URL params
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('google_user');
        window.history.replaceState({}, '', newUrl.toString());
      } catch (error) {
        console.error('Failed to parse Google user data:', error);
      }
    } else {
      console.log('[v0] No Google user param found in URL');
    }
  }, [searchParams]);

  // Define onboarding steps with their fields based on database schema
  const onboardingSteps = [
    {
      step: 1,
      title: 'Basic Information',
      description: 'Tell us about yourself',
      fields: [
        'name',
        'dob',
        'gender',
        'income in PKR (per month)',
        'religion',
        'education',
        'profession',
      ],
    },
    {
      step: 2,
      title: 'Location & Contact',
      description: 'Where are you located?',
      fields: ['city', 'state', 'country', 'language'],
    },
    {
      step: 3,
      title: 'Purpose & Values',
      description: 'What drives you in life?',
      fields: [
        'purposeDomain',
        'purposeArchetype',
        'purposeModality',
        'purposeNarrative',
      ],
    },
    {
      step: 4,
      title: 'Lifestyle & Preferences',
      description: "Tell us about your lifestyle and what you're looking for",
      fields: [
        'interests',
        'personality',
        'maritalStatus',
        'lookingFor',
        'height',
        'weight',
        'smoke',
        'alcohol',
        'drugs',
        'politics',
      ],
    },
  ];

  const totalSteps = onboardingSteps.length;
  const progress = (currentStep / totalSteps) * 100;
  const currentStepData = onboardingSteps.find(
    step => step.step === currentStep
  );

  const handleNext = (stepData: Partial<Profile>) => {
    // Merge the new step data with existing form data
    setFormData({ ...formData, ...stepData });

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding - submit to API
      handleOnboardingComplete({ ...formData, ...stepData });
    }
  };

  const handleOnboardingComplete = async (completeData: Partial<Profile>) => {
    try {
      console.log('[Onboarding] Complete onboarding data:', completeData);

      // Transform the data to match our database schema
      const transformedData = {
        ...completeData,
        // Convert date string to Date object for database
        dob: completeData.dob ? new Date(completeData.dob) : undefined,
        // Ensure arrays are properly formatted
        interests: Array.isArray(completeData.interests)
          ? completeData.interests
          : [],
        politics: Array.isArray(completeData.politics)
          ? completeData.politics
          : [],
        // Convert number fields
        income: completeData.income ? Number(completeData.income) : undefined,
        height: completeData.height ? Number(completeData.height) : undefined,
        weight: completeData.weight ? Number(completeData.weight) : undefined,
        // Filter out empty strings and undefined values
        ...Object.fromEntries(
          Object.entries(completeData).filter(
            ([, value]) =>
              value !== '' && value !== undefined && value !== null
          )
        ),
      };

      console.log('[Onboarding] Transformed data:', transformedData);

      // Submit to onboarding completion API using service
      const response =
        await onboardingService.completeOnboarding(transformedData);

      console.log('[Onboarding] Onboarding completion response:', response);

      if (response.success) {
        console.log('[Onboarding] Onboarding completion successful');

        // Update the user in the auth store with the updated user data
        if (response.user) {
          updateUser(response.user);
        }

        console.log('[Onboarding] Redirecting to dashboard...');
        // Redirect to dashboard on success
        router.push('/dashboard');
      } else {
        console.error('Failed to complete onboarding:', response.message);
        // You could show an error message here
      }
    } catch (error) {
      console.error('Onboarding completion error:', error);
      // You could show an error message here
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Pup</span>
          </Link>

          {googleUser && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center space-x-3">
                <Image
                  src={googleUser.picture}
                  alt={googleUser.name}
                  className="w-12 h-12 rounded-full border-2 border-green-300"
                />
                <div className="text-left">
                  <p className="font-medium text-green-800">
                    Welcome, {googleUser.name}!
                  </p>
                  <p className="text-sm text-green-600">
                    Signed in with Google
                  </p>
                </div>
              </div>
            </div>
          )}

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Let&apos;s set up your profile
          </h1>
          <p className="mt-2 text-muted-foreground">
            Help us understand you better to find your perfect match
          </p>
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
            {currentStepData && (
              <DynamicForm
                fields={currentStepData.fields}
                title={currentStepData.title}
                description={currentStepData.description}
                onNext={handleNext}
                initialData={formData}
              />
            )}

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
  );
}
