'use client';

import { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Target, Zap } from 'lucide-react';
import { OptionCard } from '@/components/ui';
import { useScoreStore } from '@/stores/scoreStore';
import { useQuestions } from '@/lib/useQuestions';
import { useTranslations } from '@/i18n/useTranslations';
import type { ApplicationInput, InfrastructureInput } from '@stackoverkill/shared';

export default function TestPage() {
  const router = useRouter();
  const { t } = useTranslations();
  const { appQuestions, infraQuestions } = useQuestions();
  const {
    step,
    appAnswers,
    infraAnswers,
    setStep,
    setAppAnswer,
    setInfraAnswer,
  } = useScoreStore();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const hasInitialized = useRef(false);

  const questions = step === 1 ? appQuestions : infraQuestions;
  const answers = step === 1 ? appAnswers : infraAnswers;
  const currentQuestion = questions[currentQuestionIndex];

  // Calculate progress based on current position
  const totalStep1Questions = appQuestions.length;
  const totalStep2Questions = infraQuestions.length;

  // Progress for step 1: 0 to 50% (left half)
  // Progress for step 2: 50% to ~93% (right half, never fully at 100% until result)
  // Use step to determine base progress, currentQuestionIndex for position within step
  const step1Progress = step === 1
    ? (currentQuestionIndex / totalStep1Questions) * 50
    : 50; // Step 1 complete when on step 2
  const step2Progress = step === 2
    ? (currentQuestionIndex / totalStep2Questions) * 50
    : 0;
  const totalProgress = step1Progress + step2Progress;

  const handleSelect = (questionId: string, value: number) => {
    if (isAnimating) return;

    if (step === 1) {
      setAppAnswer(questionId as keyof ApplicationInput, value);
    } else {
      setInfraAnswer(questionId as keyof InfrastructureInput, value);
    }

    // Auto-advance to next question after selection
    setIsAnimating(true);

    // Wait for fade-out animation to complete
    setTimeout(() => {
      // Disable transition and change content synchronously
      // This ensures new content appears at opacity:0 instantly (no transition)
      flushSync(() => {
        setIsTransitionEnabled(false);
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else if (step === 1) {
          // Move to step 2 - set step FIRST, then reset index
          setStep(2);
          setCurrentQuestionIndex(0);
        } else {
          // Finished - go to results
          router.push('/result');
          return;
        }
      });

      // Wait for the DOM to update with new content at opacity:0
      requestAnimationFrame(() => {
        // Re-enable transition and trigger fade-in
        flushSync(() => {
          setIsTransitionEnabled(true);
        });
        requestAnimationFrame(() => {
          setIsAnimating(false);
        });
      });
    }, 300);
  };

  const handleBack = () => {
    if (isAnimating) return;

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (step === 2) {
      setStep(1);
      setCurrentQuestionIndex(appQuestions.length - 1);
    } else {
      router.push('/');
    }
  };

  // Initialize question index on first mount only (resume progress)
  useEffect(() => {
    if (hasInitialized.current) return;
    if (appQuestions.length === 0 || infraQuestions.length === 0) return;

    hasInitialized.current = true;

    if (step === 1) {
      // Find the first unanswered question or start at 0
      const firstUnanswered = appQuestions.findIndex(
        q => appAnswers[q.id as keyof typeof appAnswers] === undefined
      );
      setCurrentQuestionIndex(firstUnanswered === -1 ? 0 : firstUnanswered);
    } else {
      const firstUnanswered = infraQuestions.findIndex(
        q => infraAnswers[q.id as keyof typeof infraAnswers] === undefined
      );
      setCurrentQuestionIndex(firstUnanswered === -1 ? 0 : firstUnanswered);
    }
  }, [appQuestions, infraQuestions, step, appAnswers, infraAnswers]);

  const currentAnswer = answers[currentQuestion?.id as keyof typeof answers];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Mobile-optimized height styles */}
      <style jsx global>{`
        @media (max-height: 700px) {
          .test-header { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
          .test-main { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
          .test-section-title { margin-bottom: 0.5rem !important; }
          .test-section-title span { padding: 0.375rem 0.75rem !important; font-size: 0.875rem !important; }
          .test-progress { margin-bottom: 1rem !important; }
          .test-spacer { height: 0.25rem !important; }
          .test-question h1 { font-size: 1.25rem !important; margin-bottom: 1rem !important; }
          .test-options { gap: 0.5rem !important; }
          .test-options button { padding: 0.625rem !important; }
          .test-hint { margin-top: 0.75rem !important; }
          .test-footer { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
        }
        @media (max-height: 600px) {
          .test-header { display: none !important; }
          .test-footer { display: none !important; }
          .test-progress-labels { display: none !important; }
          .test-question h1 { font-size: 1.125rem !important; margin-bottom: 0.75rem !important; }
        }
      `}</style>

      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="test-header relative z-10 w-full px-4 py-4 sm:py-6 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t('common.back')}</span>
          </button>
          <div className="flex items-center gap-2 text-slate-400">
            <Zap className="w-4 h-4 text-accent" />
            <span className="font-medium text-sm sm:text-base">StackOverkill.io</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="test-main relative z-10 flex-1 flex flex-col px-4 py-4 sm:py-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Section title */}
          <div className="test-section-title text-center mb-4 sm:mb-6">
            <span className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white/10 text-sm sm:text-xl font-semibold text-slate-200">
              {t('test.question')} {currentQuestionIndex + 1}{t('test.of')}{questions.length}
              <span className="text-slate-500">•</span>
              <span className="text-accent">
                {step === 1 ? t('test.steps.app') : t('test.steps.infra')}
              </span>
            </span>
          </div>

          {/* Progress bar */}
          <div className="test-progress relative pt-2 mb-4 sm:mb-8">
            {/* Background track */}
            <div className="h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden mx-6">
              {/* Progress fill */}
              <div
                className="h-full bg-gradient-to-r from-accent to-orange-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${totalProgress}%` }}
              />
            </div>

            {/* Step markers with labels */}
            <div className="test-progress-labels">
              <div className="absolute top-0 left-0 flex flex-col items-center" style={{ transform: 'translateX(0)' }}>
                <div className={`w-4 sm:w-5 h-4 sm:h-5 rounded-full border-2 transition-colors ${
                  step >= 1 ? 'bg-accent border-accent' : 'bg-slate-700 border-slate-600'
                }`} />
                <span className={`mt-1 sm:mt-2 text-[10px] sm:text-xs whitespace-nowrap ${step === 1 ? 'text-accent font-medium' : 'text-slate-500'}`}>
                  {t('test.steps.application')}
                </span>
              </div>

              <div className="absolute top-0 left-1/2 flex flex-col items-center" style={{ transform: 'translateX(-50%)' }}>
                <div className={`w-4 sm:w-5 h-4 sm:h-5 rounded-full border-2 transition-colors ${
                  step >= 2 ? 'bg-accent border-accent' : 'bg-slate-700 border-slate-600'
                }`} />
                <span className={`mt-1 sm:mt-2 text-[10px] sm:text-xs whitespace-nowrap ${step === 2 ? 'text-accent font-medium' : 'text-slate-500'}`}>
                  {t('test.steps.infrastructure')}
                </span>
              </div>

              <div className="absolute top-0 right-0 flex flex-col items-center" style={{ transform: 'translateX(0)' }}>
                <div className={`w-4 sm:w-5 h-4 sm:h-5 rounded-full border-2 transition-colors ${
                  totalProgress >= 100 ? 'bg-accent border-accent' : 'bg-slate-700 border-slate-600'
                }`} />
                <span className="mt-1 sm:mt-2 text-[10px] sm:text-xs whitespace-nowrap text-slate-500">
                  {t('test.steps.result')}
                </span>
              </div>
            </div>
          </div>
          {/* Spacer for labels */}
          <div className="test-spacer h-2 sm:h-4" />
        </div>

        {/* Question area - centered */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-0">
          <div className="w-full max-w-4xl">
            {/* Question */}
            <div
              className={`test-question ${
                isTransitionEnabled ? 'transition-all duration-300' : ''
              } ${
                isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center mb-4 sm:mb-8 font-display">
                {currentQuestion?.title}
              </h1>

              {/* Options */}
              <div className="test-options space-y-2 sm:space-y-3">
                {currentQuestion?.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(currentQuestion.id, option.value)}
                    className={`w-full p-3 sm:p-4 rounded-xl border transition-all duration-200 text-left ${
                      currentAnswer === option.value
                        ? 'bg-accent/20 border-accent text-white'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-xl sm:text-2xl">{option.emoji}</span>
                      <span className="font-medium text-sm sm:text-base">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Hint */}
              <p className="test-hint text-center text-xs sm:text-sm text-slate-500 mt-4 sm:mt-6">
                {t('test.hint')}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="test-footer relative z-10 w-full px-4 py-3 sm:py-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Zap className="w-4 h-4 text-accent" />
            <span className="font-medium">{t('common.brand')}</span>
            <span className="text-slate-600">{t('common.by')}</span>
            <a
              href="https://www.rwx-g.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Rwx-G
            </a>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-400">
            <Link href="/leaderboard" className="hover:text-white transition-colors">
              🏆 {t('footer.leaderboard')}
            </Link>
            <Link href="/mentions-legales" className="hover:text-white transition-colors">
              {t('footer.legal')}
            </Link>
            <Link href="/confidentialite" className="hover:text-white transition-colors">
              {t('footer.privacy')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
