'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/base/buttons/button';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Zap,
  Target,
  Activity,
  Settings,
  Sparkles,
} from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  icon: any;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Strategy Engine',
    description: 'Choose from 14+ specialized marketing skills to generate strategy briefs, campaign blueprints, and performance insights in seconds.',
    icon: Zap,
  },
  {
    title: 'Growth Hub',
    description: 'The 3-stage command center that audits your infrastructure, identifies your highest-leverage opportunity, and builds your scaling roadmap.',
    icon: Sparkles,
  },
  {
    title: 'Attribution Engine',
    description: 'Upload your Meta/Google CSVs and CRM data to see exactly which campaigns are driving real profit — not just platform-reported conversions.',
    icon: Target,
  },
  {
    title: 'Operations Hub',
    description: 'Execute actions directly into your SaaS stack (Meta, HubSpot, Klaviyo) via Maton AI integration.',
    icon: Activity,
  },
  {
    title: 'Settings & API Vault',
    description: 'Connect your AI providers (OpenAI, Claude, Gemini, Grok) and Maton key to unlock the full power of Maverick. All keys are AES-256 encrypted.',
    icon: Settings,
  },
];

export function OnboardingTour() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('maverick_onboarding_seen');
    if (!hasSeenTour) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeTour = () => {
    setIsVisible(false);
    localStorage.setItem('maverick_onboarding_seen', 'true');
  };

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      closeTour();
    }
  };

  if (!isVisible) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="max-w-lg w-full glass-card relative overflow-hidden">

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-0.5 bg-white/5 w-full">
          <div
            className="h-full bg-[#ff8400] transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#ff8400]/10 border border-[#ff8400]/20 flex items-center justify-center">
              <step.icon className="w-5 h-5 text-[#ff8400]" />
            </div>
            <button onClick={closeTour} className="text-white/20 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-3 mb-8">
            <p className="text-xs font-bold text-[#ff8400]">
              Step {currentStep + 1} of {TOUR_STEPS.length}
            </p>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {step.title}
            </h3>
            <p className="text-sm text-white/40 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={`flex items-center gap-1 text-xs font-medium transition-colors ${currentStep === 0 ? 'text-white/10' : 'text-white/30 hover:text-white'}`}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            <Button
              size="md"
              color="primary"
              onClick={nextStep}
              iconTrailing={ChevronRight}
            >
              {currentStep === TOUR_STEPS.length - 1 ? 'Get Started' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
