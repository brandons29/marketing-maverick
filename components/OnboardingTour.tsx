'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Zap, 
  Target, 
  Activity, 
  Settings, 
  Sparkles,
  PlayCircle
} from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  icon: any;
  target?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "The Strategy Engine",
    description: "This is your primary forge. Choose from 14+ specialized modules—from AEO Visibility to Offer Math—to generate $10M+ level marketing blueprints in seconds.",
    icon: Zap,
    target: "Performance AI"
  },
  {
    title: "Growth Command",
    description: "The 3-stage command center where Brandon (your virtual CMO) audits your infrastructure, identifies the 10x lever, and builds your scaling roadmap.",
    icon: Sparkles,
    target: "Growth"
  },
  {
    title: "Attribution Bridge",
    description: "Upload your Meta/Google CSVs to identify the 'Tracking Gap'. See exactly which campaigns are driving profit, regardless of what the ad managers claim.",
    icon: Target,
    target: "Attribution"
  },
  {
    title: "Live Operations",
    description: "Once your strategy is ready, use the Operations hub to execute actions directly into your SaaS stack (Meta, HubSpot, Klaviyo) via Maton AI.",
    icon: Activity,
    target: "Operations"
  },
  {
    title: "Vault Configuration",
    description: "The first critical step: Connect your AI providers (OpenAI, Claude, Grok) and Maton key in the Vault to unlock the full power of Maverick.",
    icon: Settings,
    target: "Settings"
  }
];

export function OnboardingTour() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('maverick_onboarding_seen');
    if (!hasSeenTour) {
      // Small delay to let the dashboard load
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
      <div className="max-w-lg w-full glass-panel border-maverick-gold/20 p-1 relative overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.15)]">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-maverick-gold/20 w-full">
          <div 
            className="h-full bg-maverick-gold transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        <div className="p-10 bg-maverick-dark-1/50">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="w-12 h-12 rounded-2xl bg-maverick-gold/10 border border-maverick-gold/20 flex items-center justify-center">
              <step.icon className="w-6 h-6 text-maverick-gold" />
            </div>
            <button onClick={closeTour} className="text-maverick-muted hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4 mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-maverick-gold">
              Step {currentStep + 1} of {TOUR_STEPS.length}
            </p>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white italic">
              {step.title}
            </h3>
            <p className="text-xs font-medium leading-loose text-maverick-muted uppercase tracking-wider">
              {step.description}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${currentStep === 0 ? 'text-white/10' : 'text-maverick-muted hover:text-white'}`}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            <button 
              onClick={nextStep}
              className="btn-synapse px-8 py-3 flex items-center gap-2 group"
            >
              {currentStep === TOUR_STEPS.length - 1 ? 'Start Dominating' : 'Next Protocol'}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Floating Context Label */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/40 border border-white/5 text-[8px] font-mono text-white/30 uppercase tracking-[0.3em]">
          Maverick Institutional Induction · v1.0
        </div>
      </div>
    </div>
  );
}
