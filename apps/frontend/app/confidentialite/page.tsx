'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Shield,
  Database,
  Cookie,
  BarChart3,
  Share2,
  UserCheck,
  Lock,
  Mail,
  FileEdit,
  Zap
} from 'lucide-react';
import { ProtectedEmail } from '@/components/ProtectedEmail';
import { useTranslations } from '@/i18n/useTranslations';

function Section({
  icon: Icon,
  title,
  children
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-accent/20 rounded-lg">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      <div className="text-slate-300 space-y-3">
        {children}
      </div>
    </section>
  );
}

function HighlightBox({
  variant = 'info',
  children
}: {
  variant?: 'info' | 'success' | 'warning';
  children: React.ReactNode;
}) {
  const styles = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-200',
    success: 'bg-green-500/10 border-green-500/30 text-green-200',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-200',
  };

  return (
    <div className={`p-4 rounded-lg border ${styles[variant]}`}>
      {children}
    </div>
  );
}

export default function ConfidentialitePage() {
  const { t } = useTranslations();

  const rights = [
    { key: 'access' },
    { key: 'rectification' },
    { key: 'erasure' },
    { key: 'portability' },
    { key: 'opposition' },
    { key: 'limitation' },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 w-full px-4 py-3 sm:py-4 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t('common.back')}</span>
          </Link>
          <div className="flex items-center gap-2 text-slate-400">
            <Zap className="w-4 h-4 text-accent" />
            <span className="font-medium text-sm sm:text-base">{t('common.brand')}</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-3xl font-bold text-white mb-2 font-display">
          {t('privacy.title')}
        </h1>
        <p className="text-slate-400 mb-8">
          {t('privacy.lastUpdate')}
        </p>

        <div className="space-y-6">
          {/* Privacy by Design */}
          <Section icon={Shield} title={t('privacy.sections.commitment.title')}>
            <p>{t('privacy.sections.commitment.intro')}</p>
            <HighlightBox variant="success">
              <p className="font-medium">{t('privacy.sections.commitment.highlight')}</p>
            </HighlightBox>
          </Section>

          {/* Data Collected */}
          <Section icon={Database} title={t('privacy.sections.dataCollected.title')}>
            <div className="space-y-6">
              {/* Test data */}
              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {t('privacy.sections.dataCollected.testData.title')}
                </h3>
                <p className="mb-3">{t('privacy.sections.dataCollected.testData.intro')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{t('privacy.sections.dataCollected.testData.items.memory')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{t('privacy.sections.dataCollected.testData.items.notStored')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{t('privacy.sections.dataCollected.testData.items.deleted')}</span>
                  </li>
                </ul>
              </div>

              {/* Leaderboard data */}
              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {t('privacy.sections.dataCollected.leaderboard.title')}
                </h3>
                <p className="mb-3" dangerouslySetInnerHTML={{ __html: t('privacy.sections.dataCollected.leaderboard.intro') }} />
                <ul className="space-y-2 mb-4 text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-500">•</span>
                    <span>{t('privacy.sections.dataCollected.leaderboard.items.nickname')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-500">•</span>
                    <span>{t('privacy.sections.dataCollected.leaderboard.items.appName')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-500">•</span>
                    <span>{t('privacy.sections.dataCollected.leaderboard.items.scores')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-500">•</span>
                    <span>{t('privacy.sections.dataCollected.leaderboard.items.verdict')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-500">•</span>
                    <span>{t('privacy.sections.dataCollected.leaderboard.items.date')}</span>
                  </li>
                </ul>
                <HighlightBox variant="info">
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: t('privacy.sections.dataCollected.leaderboard.note') }} />
                </HighlightBox>
              </div>
            </div>
          </Section>

          {/* Cookies */}
          <Section icon={Cookie} title={t('privacy.sections.cookies.title')}>
            <p className="mb-4" dangerouslySetInnerHTML={{ __html: t('privacy.sections.cookies.intro') }} />

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-white/10 rounded border border-white/10">
                  <Database className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{t('privacy.sections.cookies.localStorage.title')}</p>
                  <p className="text-sm text-slate-400 mt-1">{t('privacy.sections.cookies.localStorage.content')}</p>
                </div>
              </div>
            </div>

            <HighlightBox variant="success">
              <p className="text-sm" dangerouslySetInnerHTML={{ __html: t('privacy.sections.cookies.noCookies') }} />
            </HighlightBox>
          </Section>

          {/* Analytics */}
          <Section icon={BarChart3} title={t('privacy.sections.analytics.title')}>
            <HighlightBox variant="success">
              <p dangerouslySetInnerHTML={{ __html: t('privacy.sections.analytics.content') }} />
              <p className="text-sm mt-2 opacity-80">{t('privacy.sections.analytics.detail')}</p>
            </HighlightBox>
          </Section>

          {/* Data Sharing */}
          <Section icon={Share2} title={t('privacy.sections.sharing.title')}>
            <p dangerouslySetInnerHTML={{ __html: t('privacy.sections.sharing.intro') }} />
            <ul className="mt-3 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">✗</span>
                <span>{t('privacy.sections.sharing.items.sold')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">✗</span>
                <span>{t('privacy.sections.sharing.items.rented')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">✗</span>
                <span>{t('privacy.sections.sharing.items.shared')}</span>
              </li>
            </ul>
          </Section>

          {/* Your Rights (GDPR) */}
          <Section icon={UserCheck} title={t('privacy.sections.rights.title')}>
            <p className="mb-4">{t('privacy.sections.rights.intro')}</p>

            <div className="grid gap-3 sm:grid-cols-2">
              {rights.map((right) => (
                <div key={right.key} className="bg-white/5 rounded-lg p-3">
                  <p className="font-medium text-white text-sm">{t(`privacy.sections.rights.items.${right.key}.title`)}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t(`privacy.sections.rights.items.${right.key}.desc`)}</p>
                </div>
              ))}
            </div>

            <HighlightBox variant="info">
              <p className="text-sm" dangerouslySetInnerHTML={{ __html: t('privacy.sections.rights.note') }} />
            </HighlightBox>
          </Section>

          {/* Security */}
          <Section icon={Lock} title={t('privacy.sections.security.title')}>
            <p className="mb-4">{t('privacy.sections.security.intro')}</p>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="p-1.5 bg-green-500/20 rounded">
                  <Lock className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{t('privacy.sections.security.items.https.title')}</p>
                  <p className="text-sm text-slate-400">{t('privacy.sections.security.items.https.desc')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1.5 bg-green-500/20 rounded">
                  <Shield className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{t('privacy.sections.security.items.headers.title')}</p>
                  <p className="text-sm text-slate-400">{t('privacy.sections.security.items.headers.desc')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1.5 bg-green-500/20 rounded">
                  <BarChart3 className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{t('privacy.sections.security.items.rateLimit.title')}</p>
                  <p className="text-sm text-slate-400">{t('privacy.sections.security.items.rateLimit.desc')}</p>
                </div>
              </li>
            </ul>
          </Section>

          {/* DPO Contact */}
          <Section icon={Mail} title={t('privacy.sections.dpo.title')}>
            <p className="mb-4">{t('privacy.sections.dpo.intro')}</p>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-slate-500 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-300 mb-1">{t('privacy.sections.dpo.byEmail')}</p>
                  <ProtectedEmail user="privacy" domain="rwx-g" tld="fr" className="text-accent hover:text-accent/80" />
                </div>
              </div>
            </div>
          </Section>

          {/* Policy Changes */}
          <Section icon={FileEdit} title={t('privacy.sections.changes.title')}>
            <p>{t('privacy.sections.changes.content1')}</p>
            <p className="mt-3">{t('privacy.sections.changes.content2')}</p>
          </Section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-4 py-3 sm:py-4 border-t border-white/10">
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
            <span className="text-white">{t('footer.privacy')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
