'use client';

import { useMemo } from 'react';
import { useTranslations } from '@/i18n/useTranslations';

export interface QuestionOption {
  value: number;
  emoji: string;
  label: string;
}

export interface Question {
  id: string;
  title: string;
  options: QuestionOption[];
}

// Emoji mappings (these don't change with language)
const APP_QUESTION_EMOJIS: Record<string, Record<number, string>> = {
  criticality: { 1: '🧪', 2: '🔧', 3: '📊', 4: '⚡', 5: '🎯' },
  userCount: { 1: '👤', 2: '👥', 3: '🏠', 4: '🏢', 5: '🏙️', 6: '🌍' },
  financialImpact: { 1: '🎈', 2: '💡', 3: '💵', 4: '💰', 5: '💎', 6: '🏦' },
  availability: { 1: '🤷', 2: '🕐', 3: '📅', 4: '📈', 5: '🎯', 6: '⚡' },
  exposure: { 1: '🏠', 2: '🔐', 3: '☁️', 4: '🔑', 5: '🌐' },
  complexity: { 1: '📝', 2: '📋', 3: '⚙️', 4: '🔧', 5: '🏗️' },
  dataSensitivity: { 1: '📢', 2: '📁', 3: '🔏', 4: '🛡️' },
};

const INFRA_QUESTION_EMOJIS: Record<string, Record<number, string>> = {
  sophistication: { 1: '🖥️', 2: '📦', 3: '🐳', 4: '⚓', 5: '☸️', 6: '🌌' },
  resilience: { 1: '🎲', 2: '💾', 3: '🔄', 4: '🔁', 5: '⚡', 6: '🌍' },
  cost: { 1: '🏠', 2: '🪙', 3: '💵', 4: '💰', 5: '💎', 6: '🏦' },
  teamCapacity: { 1: '🧑', 2: '👥', 3: '🏢', 4: '🏙️', 5: '🌐' },
  operationalMaturity: { 1: '🎲', 2: '📝', 3: '📊', 4: '📈', 5: '🎯' },
  automation: { 1: '🖱️', 2: '📜', 3: '🔧', 4: '⚙️', 5: '🤖' },
  security: { 1: '🚪', 2: '🔒', 3: '🛡️', 4: '🏰' },
};

const APP_QUESTION_IDS = [
  'criticality',
  'userCount',
  'financialImpact',
  'availability',
  'exposure',
  'complexity',
  'dataSensitivity',
];

const INFRA_QUESTION_IDS = [
  'sophistication',
  'resilience',
  'cost',
  'teamCapacity',
  'operationalMaturity',
  'automation',
  'security',
];

export function useQuestions() {
  const { t, locale, isHydrated } = useTranslations();

  const appQuestions = useMemo((): Question[] => {
    return APP_QUESTION_IDS.map((id) => {
      const emojis = APP_QUESTION_EMOJIS[id];
      const optionValues = Object.keys(emojis).map(Number);

      return {
        id,
        title: t(`test.questions.app.${id}.title` as any),
        options: optionValues.map((value) => ({
          value,
          emoji: emojis[value],
          label: t(`test.questions.app.${id}.options.${value}` as any),
        })),
      };
    });
  }, [t, locale]);

  const infraQuestions = useMemo((): Question[] => {
    return INFRA_QUESTION_IDS.map((id) => {
      const emojis = INFRA_QUESTION_EMOJIS[id];
      const optionValues = Object.keys(emojis).map(Number);

      return {
        id,
        title: t(`test.questions.infra.${id}.title` as any),
        options: optionValues.map((value) => ({
          value,
          emoji: emojis[value],
          label: t(`test.questions.infra.${id}.options.${value}` as any),
        })),
      };
    });
  }, [t, locale]);

  return {
    appQuestions,
    infraQuestions,
    isHydrated,
  };
}
