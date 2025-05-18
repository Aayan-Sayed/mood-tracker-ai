import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface OnboardingModalProps {
  onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const { themeColors } = useTheme();
  const [step, setStep] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      title: 'Welcome to MoodTracker',
      description:
        'Track your daily emotions, identify patterns, and gain insights to improve your mental wellbeing.',
      image: '😊',
    },
    {
      title: 'Log Your Mood',
      description:
        'Select the emoji that best represents how you feel each day. Consistency is key!',
      image: '📝',
    },
    {
      title: 'Track Your Progress',
      description:
        'View your mood patterns over time with beautiful visualizations and gain insights into your emotional wellbeing.',
      image: '📊',
    },
    {
      title: 'Journal Your Thoughts',
      description:
        'Add notes to your mood entries to capture what influenced your feelings each day.',
      image: '📔',
    },
  ];

  useEffect(() => {
    // Close modal when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onComplete();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onComplete]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className={`${themeColors.card} rounded-xl shadow-xl max-w-md w-full scale-in overflow-hidden relative`}
      >
        {/* Progress bar */}
        <div className="w-full h-1 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          ></div>
        </div>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{steps[step].image}</div>
            <h2 className={`text-2xl font-bold ${themeColors.text} mb-2`}>
              {steps[step].title}
            </h2>
            <p className={`${themeColors.textSecondary}`}>
              {steps[step].description}
            </p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className={`px-4 py-2 rounded-lg ${
                step === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Back
            </button>
            
            <button
              onClick={handleNext}
              className={`px-4 py-2 rounded-lg ${themeColors.primary} text-white transition-all hover:opacity-90`}
            >
              {step < steps.length - 1 ? 'Next' : 'Get Started'}
            </button>
          </div>

          <div className="mt-5 text-center">
            <button
              onClick={onComplete}
              className={`text-sm ${themeColors.textSecondary} hover:underline`}
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;