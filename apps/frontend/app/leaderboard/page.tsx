'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, Trophy, ArrowLeft, RefreshCw, Flame, Snowflake, CheckCircle } from 'lucide-react';
import { useScoreStore } from '@/stores/scoreStore';
import { useTranslations } from '@/i18n/useTranslations';
import type { LeaderboardEntry } from '@stackoverkill/shared';

const VERDICT_CONFIG: Record<string, { emoji: string; label: string; color: string; bgColor: string }> = {
  OVERKILL_SEVERE: { emoji: '💀', label: 'OVERKILL SÉVÈRE', color: 'text-red-500', bgColor: 'bg-red-500' },
  OVERKILL: { emoji: '🔥', label: 'OVERKILL', color: 'text-orange-500', bgColor: 'bg-orange-500' },
  SLIGHT_OVERKILL: { emoji: '⚡', label: 'OVERKILL LÉGER', color: 'text-yellow-500', bgColor: 'bg-yellow-500' },
  BALANCED: { emoji: '✅', label: 'ÉQUILIBRÉ', color: 'text-green-500', bgColor: 'bg-green-500' },
  SLIGHT_UNDERKILL: { emoji: '🌧️', label: 'UNDERKILL LÉGER', color: 'text-cyan-500', bgColor: 'bg-cyan-500' },
  UNDERKILL: { emoji: '❄️', label: 'UNDERKILL', color: 'text-blue-500', bgColor: 'bg-blue-500' },
  UNDERKILL_SEVERE: { emoji: '🌊', label: 'UNDERKILL SÉVÈRE', color: 'text-purple-500', bgColor: 'bg-purple-500' },
};

type SortType = 'overkill' | 'balanced' | 'underkill';

const SORT_OPTIONS: { id: SortType; labelKey: string; icon: typeof Flame; color: string }[] = [
  { id: 'overkill', labelKey: 'leaderboard.sort.overkill', icon: Flame, color: 'text-orange-500' },
  { id: 'balanced', labelKey: 'leaderboard.sort.balanced', icon: CheckCircle, color: 'text-green-500' },
  { id: 'underkill', labelKey: 'leaderboard.sort.underkill', icon: Snowflake, color: 'text-blue-500' },
];

function LeaderboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslations();
  const highlightNickname = searchParams.get('highlight');
  const highlightRef = useRef<HTMLDivElement>(null);
  const resetStore = useScoreStore((state) => state.reset);

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortType>('overkill');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Scroll to highlighted entry after loading
  useEffect(() => {
    if (!loading && highlightNickname && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [loading, highlightNickname]);

  const fetchLeaderboard = async (page: number, sort: SortType, highlight?: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const params = new URLSearchParams({ page: String(page), sort });
      if (highlight) {
        params.set('highlight', highlight);
      }
      const response = await fetch(`${apiUrl}/api/v1/leaderboard?${params}`);
      if (!response.ok) throw new Error(t('leaderboard.loadError'));
      const data = await response.json();
      setEntries(data.entries || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
      return data.highlightPage as number | undefined;
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
      setError(t('leaderboard.error'));
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  // Initial load: find the page for highlighted user if needed
  useEffect(() => {
    const initLoad = async () => {
      const highlightPage = await fetchLeaderboard(1, sortBy, highlightNickname);
      if (highlightPage && highlightPage !== 1) {
        setCurrentPage(highlightPage);
        await fetchLeaderboard(highlightPage, sortBy, highlightNickname);
      }
    };
    initLoad();
  }, []);

  // Refetch when page or sort changes (but not on initial load)
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    fetchLeaderboard(currentPage, sortBy);
  }, [currentPage, sortBy]);

  // Entries are already sorted by the backend

  // Global index offset for current page (100 entries per page from backend)
  const PAGE_SIZE = 100;
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  // Ref for scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Page navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Height-based responsive styles for small viewports */}
      <style jsx global>{`
        @media (max-height: 700px) {
          .lb-header { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
          .lb-main { padding-top: 1rem !important; padding-bottom: 1rem !important; }
          .lb-title { margin-bottom: 0.5rem !important; }
          .lb-title-inner { margin-bottom: 0.25rem !important; }
          .lb-title h1 { font-size: 1.5rem !important; }
          .lb-title .trophy-icon { width: 1.75rem !important; height: 1.75rem !important; }
          .lb-title p { display: none; }
          .lb-sort { margin-bottom: 0.5rem !important; }
          .lb-sort span:first-child { display: none; }
          .lb-footer { padding-top: 1rem !important; padding-bottom: 1rem !important; }
          .lb-bottom { padding-top: 0.5rem !important; }
          .lb-bottom .lb-cta { display: none; }
        }
        @media (max-height: 500px) {
          .lb-header { display: none !important; }
          .lb-footer { display: none !important; }
          .lb-title-inner { margin-bottom: 0.25rem !important; }
          .lb-sort button { padding: 0.25rem 0.5rem !important; font-size: 0.75rem !important; }
        }
      `}</style>
      <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="lb-header relative z-10 flex-shrink-0 w-full px-4 py-3 sm:py-4 border-b border-white/10">
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

      {/* Main content */}
      <main className="lb-main relative z-10 flex-1 min-h-0 flex flex-col px-4 py-4 sm:py-8 overflow-hidden">
        <div className="max-w-4xl mx-auto w-full flex flex-col flex-1 min-h-0">
          {/* Title */}
          <div className="lb-title text-center mb-4 sm:mb-6 flex-shrink-0">
            <div className="lb-title-inner inline-flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
              <Trophy className="trophy-icon w-7 h-7 sm:w-10 sm:h-10 text-yellow-500" />
              <h1 className="text-2xl sm:text-4xl font-bold font-display">{t('leaderboard.title')}</h1>
              <button
                onClick={() => fetchLeaderboard(currentPage, sortBy)}
                disabled={loading}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all disabled:opacity-50"
                title={t('leaderboard.refresh')}
              >
                <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? 'animate-spin' : 'hover:rotate-180 transition-transform duration-500'}`} />
              </button>
            </div>
            <p className="text-slate-400 text-sm sm:text-base">
              {t('leaderboard.subtitle')}
            </p>
          </div>

          {/* Sort options */}
          <div className="lb-sort flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-shrink-0">
            <span className="hidden sm:flex items-center text-sm text-slate-500 mr-2">{t('leaderboard.sortBy')}</span>
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  if (option.id !== sortBy) {
                    setCurrentPage(1);
                    setSortBy(option.id);
                  }
                }}
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  sortBy === option.id
                    ? 'bg-white/15 border-white/30 text-white'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                } border`}
              >
                <option.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${sortBy === option.id ? option.color : ''}`} />
                {t(option.labelKey as any)}
              </button>
            ))}
          </div>

          {/* Table header row - fixed outside scroll */}
          {!loading && !error && entries.length > 0 && (
            <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-4 py-2 text-xs text-slate-500 uppercase tracking-wider flex-shrink-0">
              <div className="col-span-1">{t('leaderboard.table.rank')}</div>
              <div className="col-span-3">{t('leaderboard.table.nickname')}</div>
              <div className="col-span-3">{t('leaderboard.table.app')}</div>
              <div className="col-span-2 text-center">{t('leaderboard.table.scores')}</div>
              <div className="col-span-3 text-right">{t('leaderboard.table.verdict')}</div>
            </div>
          )}

          {/* Scrollable entries area with fade effect using mask-image */}
          <div className="relative flex-1 min-h-0">
            <div
              ref={scrollContainerRef}
              className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide py-4"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 24px, black calc(100% - 24px), transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 24px, black calc(100% - 24px), transparent 100%)'
              }}
            >
            {/* Loading state */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  {t('leaderboard.loading')}
                </div>
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => fetchLeaderboard(currentPage, sortBy)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {t('leaderboard.retry')}
                </button>
              </div>
            )}

            {/* Empty state - no entries at all */}
            {!loading && !error && entries.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏜️</div>
                <p className="text-slate-400 mb-6">{t('leaderboard.empty')}</p>
                <button
                  onClick={() => {
                    resetStore();
                    router.push('/test');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-xl transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  {t('leaderboard.beFirst')}
                </button>
              </div>
            )}

            {/* Leaderboard entries */}
            {!loading && !error && entries.length > 0 && (
              <div className="space-y-2">
              {/* Entries */}
              {entries.map((entry, index) => {
                const config = VERDICT_CONFIG[entry.verdict] || VERDICT_CONFIG.BALANCED;
                const gap = entry.scoreInfra - entry.scoreApp;
                const globalIndex = startIndex + index;
                const isTop3 = globalIndex < 3;
                const isHighlighted = highlightNickname === entry.nickname;

                return (
                  <div
                    key={entry.id}
                    ref={isHighlighted ? highlightRef : undefined}
                    className={`relative p-3 rounded-lg border transition-all ${
                      isHighlighted
                        ? 'bg-accent/20 border-accent shadow-lg shadow-accent/20'
                        : isTop3
                          ? 'bg-white/5 border-yellow-500/30 shadow-lg shadow-yellow-500/10 hover:bg-white/10'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {/* "It's you!" badge - stamp style between pseudo and app */}
                    {isHighlighted && (
                      <div
                        className="absolute px-2 py-0.5 bg-accent text-white text-xs font-bold rounded-full shadow-lg"
                        style={{ transform: 'rotate(-8deg)', left: '215px', top: '16px' }}
                      >
                        {t('leaderboard.itsYou')}
                      </div>
                    )}
                    {/* Mobile layout */}
                    <div className="sm:hidden space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`text-base font-bold ${isTop3 ? 'text-yellow-500' : 'text-slate-500'}`}>
                            {globalIndex === 0 ? '🥇' : globalIndex === 1 ? '🥈' : globalIndex === 2 ? '🥉' : `#${globalIndex + 1}`}
                          </span>
                          <div>
                            <p className="font-medium text-white text-sm">{entry.nickname}</p>
                            <p className="text-xs text-slate-500">{entry.appName}</p>
                          </div>
                        </div>
                        <span className="text-lg">{config.emoji}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-primary-400">APP {entry.scoreApp}</span>
                          <span className="text-slate-500">vs</span>
                          <span className="text-accent">INFRA {entry.scoreInfra}</span>
                        </div>
                        <span className={`font-medium ${config.color}`}>
                          {gap > 0 ? '+' : ''}{gap}
                        </span>
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden sm:grid sm:grid-cols-12 gap-3 items-center">
                      <div className="col-span-1">
                        <span className={`text-base font-bold ${isTop3 ? 'text-yellow-500' : 'text-slate-500'}`}>
                          {globalIndex === 0 ? '🥇' : globalIndex === 1 ? '🥈' : globalIndex === 2 ? '🥉' : `#${globalIndex + 1}`}
                        </span>
                      </div>
                      <div className="col-span-3">
                        <p className="font-medium text-white text-sm truncate">{entry.nickname}</p>
                      </div>
                      <div className="col-span-3">
                        <p className="text-sm text-slate-400 truncate">{entry.appName}</p>
                      </div>
                      <div className="col-span-2 text-center text-sm">
                        <span className="text-primary-400">{entry.scoreApp}</span>
                        <span className="text-slate-600 mx-1">/</span>
                        <span className="text-accent">{entry.scoreInfra}</span>
                      </div>
                      <div className="col-span-3 flex items-center justify-end gap-2">
                        <span className={`text-sm font-medium ${config.color}`}>
                          {gap > 0 ? '+' : ''}{gap}
                        </span>
                        <span className="text-lg">{config.emoji}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            )}
            </div>
          </div>

          {/* Bottom section (pagination, total, CTA) */}
          <div className="lb-bottom flex-shrink-0 pt-4">
            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {t('leaderboard.previous')}
                </button>
                <div className="flex items-center gap-1 px-4">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        page === currentPage
                          ? 'bg-accent text-white'
                          : 'bg-white/5 hover:bg-white/10 text-slate-400'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {t('leaderboard.next')}
                </button>
              </div>
            )}

            {/* Total count */}
            {!loading && total > 0 && (
              <p className="text-center text-sm text-slate-500 mt-4">
                {total > 1
                  ? t('leaderboard.totalEntriesPlural').replace('{count}', String(total))
                  : t('leaderboard.totalEntries').replace('{count}', String(total))}
              </p>
            )}

            {/* CTA */}
            {!loading && entries.length > 0 && (
              <div className="lb-cta text-center mt-6">
                <p className="text-slate-400 mb-4">{t('leaderboard.joinCta')}</p>
                <button
                  onClick={() => {
                    resetStore();
                    router.push('/test');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-xl transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  {t('leaderboard.takeTest')}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="lb-footer relative z-10 flex-shrink-0 w-full px-4 py-3 sm:py-4 border-t border-white/10">
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
            <span className="text-white">🏆 {t('footer.leaderboard')}</span>
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
    </>
  );
}

// Loading fallback for Suspense
function LeaderboardLoading() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 text-center">
        <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4 animate-pulse" />
        <p className="text-slate-400">Loading leaderboard...</p>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<LeaderboardLoading />}>
      <LeaderboardContent />
    </Suspense>
  );
}
