'use client';

import { Suspense, useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { useSearchParams } from 'next/navigation';

function UnauthorizedBanner() {
  const searchParams = useSearchParams();
  const isUnauthorized = searchParams?.get('error') === 'unauthorized';
  if (!isUnauthorized) return null;
  return (
    <div className="bg-rose-50 border border-rose-200 text-rose-900 text-sm px-4 py-3 mb-6">
      That email is not authorized for this dashboard.
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const allowedEmail = process.env.NEXT_PUBLIC_ALLOWED_EMAIL?.toLowerCase() || '';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    if (email.toLowerCase() !== allowedEmail) {
      setStatus('error');
      setErrorMsg('This email is not authorized for this dashboard.');
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
    } else {
      setStatus('sent');
    }
  }

  if (status === 'sent') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-6">
        <div className="font-serif italic text-2xl mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
          Check your inbox.
        </div>
        <p className="text-sm">A magic link is on its way to {email}. Click it to log in.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-semibold uppercase tracking-widest text-stone-600 block mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@vryfid.com"
          required
          className="w-full px-3 py-2 border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-stone-900"
        />
      </div>

      {errorMsg && <div className="text-sm text-rose-600">{errorMsg}</div>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-stone-900 text-amber-50 px-4 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-stone-700 disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending…' : 'Send magic link'}
      </button>

      <p className="text-xs text-stone-500 text-center pt-4">
        Only the authorized email can access this dashboard.
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#FAFAF7' }}>
      <div className="w-full max-w-md">
        <div className="border-b-2 border-stone-900 pb-6 mb-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-stone-600 mb-2">
            The Exchange · Founder Dashboard
          </div>
          <h1 className="font-serif italic font-light text-4xl" style={{ fontFamily: "'Fraunces', serif" }}>
            Sign in.
          </h1>
        </div>

        <Suspense fallback={null}>
          <UnauthorizedBanner />
        </Suspense>

        <LoginForm />
      </div>
    </div>
  );
}
