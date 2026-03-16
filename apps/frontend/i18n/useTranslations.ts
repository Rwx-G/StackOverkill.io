'use client';

import { useEffect, useState } from 'react';
import { useLocaleStore } from '@/stores/localeStore';
import type { Locale } from './config';

// Import all message files statically for client-side use
import en from '@/messages/en.json';
import fr from '@/messages/fr.json';
import de from '@/messages/de.json';
import it from '@/messages/it.json';
import es from '@/messages/es.json';

type Messages = typeof en;

const messagesMap: Record<Locale, Messages> = {
  en,
  fr,
  de,
  it,
  es,
};

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
          : `${K}`
        : never;
    }[keyof T]
  : never;

type TranslationKey = NestedKeyOf<Messages>;

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path; // Return the key itself if not found
    }
  }

  return typeof result === 'string' ? result : path;
}

function getNestedArray(obj: Record<string, unknown>, path: string): string[] {
  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return []; // Return empty array if not found
    }
  }

  return Array.isArray(result) ? result : [];
}

export function useTranslations() {
  const locale = useLocaleStore((state) => state.locale);
  const initializeLocale = useLocaleStore((state) => state.initializeLocale);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    initializeLocale();
    setIsHydrated(true);
  }, [initializeLocale]);

  const messages = messagesMap[locale];

  const t = (key: TranslationKey): string => {
    return getNestedValue(messages as Record<string, unknown>, key);
  };

  const tArray = (key: string): string[] => {
    return getNestedArray(messages as Record<string, unknown>, key);
  };

  // Get verdict phrases for the result page
  const getVerdictPhrases = (verdict: string): string[] => {
    return tArray(`result.verdicts.${verdict}.phrases`);
  };

  return { t, tArray, getVerdictPhrases, locale, isHydrated };
}

// Hook for getting a specific namespace of translations
export function useTranslationsNamespace<K extends keyof Messages>(namespace: K) {
  const { t, locale, isHydrated } = useTranslations();

  const tNs = (key: string): string => {
    return t(`${namespace}.${key}` as TranslationKey);
  };

  return { t: tNs, locale, isHydrated };
}
