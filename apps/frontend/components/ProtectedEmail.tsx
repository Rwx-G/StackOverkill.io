'use client';

import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';

interface ProtectedEmailProps {
  user: string;
  domain: string;
  tld: string;
  className?: string;
}

/**
 * Anti-spam email component that only reveals the email on client-side
 * The email is split into parts and assembled via JavaScript to prevent bot scraping
 */
export function ProtectedEmail({ user, domain, tld, className = '' }: ProtectedEmailProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Assemble email only on client-side
    setEmail(`${user}@${domain}.${tld}`);
  }, [user, domain, tld]);

  const handleClick = () => {
    if (email) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!email) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-slate-400 ${className}`}>
        <Mail className="w-4 h-4" />
        <span>[Chargement...]</span>
      </span>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 font-medium hover:underline transition-colors cursor-pointer ${className || 'text-accent hover:text-accent/80'}`}
      title="Cliquer pour copier"
    >
      <Mail className="w-4 h-4 flex-shrink-0" />
      <span>{email}</span>
      {copied && (
        <span className="ml-1 text-xs text-green-600 font-normal">(copié !)</span>
      )}
    </button>
  );
}
