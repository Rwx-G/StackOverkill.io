import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ApplicationInput, InfrastructureInput, ScoreResult } from '@stackoverkill/shared';

interface LeaderboardEntry {
  nickname: string;
  appName: string;
  scoreApp: number;
  scoreInfra: number;
}

interface ScoreStore {
  // Current step in the test flow
  step: 1 | 2;

  // Application answers (partial until complete)
  appAnswers: Partial<ApplicationInput>;

  // Infrastructure answers (partial until complete)
  infraAnswers: Partial<InfrastructureInput>;

  // Result after calculation
  result: ScoreResult | null;

  // Leaderboard participation (persisted to prevent duplicate submissions)
  leaderboardEntry: LeaderboardEntry | null;

  // Actions
  setStep: (step: 1 | 2) => void;
  setAppAnswer: <K extends keyof ApplicationInput>(
    key: K,
    value: ApplicationInput[K]
  ) => void;
  setInfraAnswer: <K extends keyof InfrastructureInput>(
    key: K,
    value: InfrastructureInput[K]
  ) => void;
  setResult: (result: ScoreResult) => void;
  setLeaderboardEntry: (entry: LeaderboardEntry) => void;
  reset: () => void;

  // Computed
  isAppComplete: () => boolean;
  isInfraComplete: () => boolean;
  getCompleteInput: () => { app: ApplicationInput; infra: InfrastructureInput } | null;
}

const APP_KEYS: (keyof ApplicationInput)[] = [
  'criticality',
  'userCount',
  'financialImpact',
  'availability',
  'exposure',
  'complexity',
  'dataSensitivity',
];

const INFRA_KEYS: (keyof InfrastructureInput)[] = [
  'sophistication',
  'resilience',
  'cost',
  'teamCapacity',
  'operationalMaturity',
  'automation',
  'security',
];

export const useScoreStore = create<ScoreStore>()(
  persist(
    (set, get) => ({
      step: 1,
      appAnswers: {},
      infraAnswers: {},
      result: null,
      leaderboardEntry: null,

      setStep: (step) => set({ step }),

      setAppAnswer: (key, value) =>
        set((state) => ({
          appAnswers: { ...state.appAnswers, [key]: value },
        })),

      setInfraAnswer: (key, value) =>
        set((state) => ({
          infraAnswers: { ...state.infraAnswers, [key]: value },
        })),

      setResult: (result) => set({ result }),

      setLeaderboardEntry: (entry) => set({ leaderboardEntry: entry }),

      reset: () =>
        set({
          step: 1,
          appAnswers: {},
          infraAnswers: {},
          result: null,
          leaderboardEntry: null,
        }),

      isAppComplete: () => {
        const { appAnswers } = get();
        return APP_KEYS.every((key) => appAnswers[key] !== undefined);
      },

      isInfraComplete: () => {
        const { infraAnswers } = get();
        return INFRA_KEYS.every((key) => infraAnswers[key] !== undefined);
      },

      getCompleteInput: () => {
        const { appAnswers, infraAnswers } = get();
        const isAppComplete = APP_KEYS.every(
          (key) => appAnswers[key] !== undefined
        );
        const isInfraComplete = INFRA_KEYS.every(
          (key) => infraAnswers[key] !== undefined
        );

        if (!isAppComplete || !isInfraComplete) {
          return null;
        }

        return {
          app: appAnswers as ApplicationInput,
          infra: infraAnswers as InfrastructureInput,
        };
      },
    }),
    {
      name: 'stackoverkill-score',
    }
  )
);
