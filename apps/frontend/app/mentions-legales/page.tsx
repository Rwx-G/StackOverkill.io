'use client';

import Link from 'next/link';
import { ArrowLeft, Building2, Server, Scale, AlertTriangle, Mail, Zap } from 'lucide-react';
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

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-2">
      <span className="font-medium text-slate-400 sm:min-w-[140px]">{label}</span>
      <span className="text-slate-200">{value}</span>
    </div>
  );
}

export default function MentionsLegalesPage() {
  const { t } = useTranslations();

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
          {t('legal.title')}
        </h1>
        <p className="text-slate-400 mb-8">
          {t('legal.subtitle')}
        </p>

        <div className="space-y-6">
          {/* Publisher */}
          <Section icon={Building2} title={t('legal.sections.publisher.title')}>
            <p className="mb-4" dangerouslySetInnerHTML={{ __html: t('legal.sections.publisher.intro') }} />
            <div className="bg-white/5 rounded-lg p-4 space-y-2">
              <InfoRow label={t('legal.sections.publisher.publisherName')} value={<strong className="text-white">Rwx-G</strong>} />
              <InfoRow label={t('legal.sections.publisher.status')} value={t('legal.sections.publisher.statusValue')} />
              <InfoRow label={t('legal.sections.publisher.website')} value={<a href="https://www.rwx-g.fr" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80">www.rwx-g.fr</a>} />
              <InfoRow
                label={t('legal.sections.publisher.email')}
                value={<ProtectedEmail user="contact" domain="rwx-g" tld="fr" className="text-accent hover:text-accent/80" />}
              />
            </div>
          </Section>

          {/* Hosting */}
          <Section icon={Server} title={t('legal.sections.hosting.title')}>
            <p className="mb-4">{t('legal.sections.hosting.intro')}</p>
            <div className="bg-white/5 rounded-lg p-4 space-y-2">
              <InfoRow label={t('legal.sections.hosting.host')} value={<strong className="text-white">Rwx-G</strong>} />
              <InfoRow label={t('legal.sections.hosting.type')} value={t('legal.sections.hosting.typeValue')} />
            </div>
          </Section>

          {/* Intellectual Property */}
          <Section icon={Scale} title={t('legal.sections.ip.title')}>
            <p>{t('legal.sections.ip.intro')}</p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-3 text-slate-400">
              <li>{t('legal.sections.ip.items.texts')}</li>
              <li>{t('legal.sections.ip.items.images')}</li>
              <li>{t('legal.sections.ip.items.logo')}</li>
              <li>{t('legal.sections.ip.items.code')}</li>
              <li>{t('legal.sections.ip.items.structure')}</li>
            </ul>
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-amber-200 text-sm" dangerouslySetInnerHTML={{ __html: t('legal.sections.ip.warning') }} />
            </div>
          </Section>

          {/* Limitation of Liability */}
          <Section icon={AlertTriangle} title={t('legal.sections.liability.title')}>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-white mb-2">{t('legal.sections.liability.nature.title')}</h3>
                <p dangerouslySetInnerHTML={{ __html: t('legal.sections.liability.nature.content') }} />
              </div>

              <div>
                <h3 className="font-medium text-white mb-2">{t('legal.sections.liability.declarative.title')}</h3>
                <p>{t('legal.sections.liability.declarative.content')}</p>
              </div>

              <div>
                <h3 className="font-medium text-white mb-2">{t('legal.sections.liability.decisions.title')}</h3>
                <p>{t('legal.sections.liability.decisions.content')}</p>
              </div>
            </div>
          </Section>

          {/* Contact */}
          <Section icon={Mail} title={t('legal.sections.contact.title')}>
            <p className="mb-4">{t('legal.sections.contact.intro')}</p>
            <div className="bg-white/5 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <span className="font-medium text-slate-400">{t('legal.sections.contact.email')}</span>
                <ProtectedEmail user="contact" domain="rwx-g" tld="fr" className="text-accent hover:text-accent/80" />
              </div>
              <div className="flex items-start gap-3">
                <span className="font-medium text-slate-400">{t('legal.sections.contact.website')}</span>
                <a href="https://www.rwx-g.fr" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80">www.rwx-g.fr</a>
              </div>
            </div>
          </Section>
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          {t('legal.lastUpdate')}
        </p>
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
            <span className="text-white">{t('footer.legal')}</span>
            <Link href="/confidentialite" className="hover:text-white transition-colors">
              {t('footer.privacy')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
