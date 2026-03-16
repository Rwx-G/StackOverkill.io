import Link from 'next/link';
import { ArrowLeft, Zap, Search, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 flex-shrink-0 w-full px-4 py-6 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          <div className="flex items-center gap-2 text-slate-400">
            <Zap className="w-4 h-4 text-accent" />
            <span className="font-medium">StackOverkill.io</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* 404 Icon */}
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <Search className="w-10 h-10 text-slate-400" />
          </div>

          {/* Error code */}
          <div className="text-8xl font-bold font-display text-white/10 mb-2">
            404
          </div>

          {/* Message */}
          <h1 className="text-2xl font-bold text-white mb-3 font-display">
            Page introuvable
          </h1>
          <p className="text-slate-400 mb-8">
            Cette page n'existe pas ou a peut-etre demenage.
            Pas de panique, ton infra n'est pas en cause !
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-xl transition-colors"
            >
              <Home className="w-4 h-4" />
              Retour a l'accueil
            </Link>
            <Link
              href="/test"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-colors"
            >
              <Zap className="w-4 h-4" />
              Faire le test
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex-shrink-0 w-full px-4 py-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Zap className="w-4 h-4 text-accent" />
            <span className="font-medium">StackOverkill.io</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">
              Mentions legales
            </Link>
            <Link href="/confidentialite" className="hover:text-white transition-colors">
              Confidentialite
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
