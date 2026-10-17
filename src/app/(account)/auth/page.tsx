'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/account/profile';

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [requestId, setRequestId] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [existingUser, setExistingUser] = useState<{
    name?: string;
    phone?: string;
    role?: string;
    isOpsOrAdmin?: boolean;
    isOwner?: boolean;
  } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Check if user is already signed in
  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.authenticated && data.user) {
          setExistingUser(data.user);
          const dest =
            nextUrl && nextUrl !== '/auth' && nextUrl !== '/auth/'
              ? nextUrl
              : data.user.isOpsOrAdmin
              ? '/admin'
              : data.user.isOwner
              ? '/owner'
              : '/account/profile';
          router.replace(dest);
        }
      })
      .catch(() => {})
      .finally(() => setCheckingAuth(false));
  }, [nextUrl, router]);

  // Countdown timer for resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to send verification code.');
      }

      setRequestId(data.requestId);
      setMaskedPhone(data.maskedPhone || `+91 ${cleanPhone.slice(0, 5)}*** **${cleanPhone.slice(-2)}`);
      setDigits(['', '', '', '', '', '']);
      if (data.devOtp) {
        setDevOtp(data.devOtp);
      }
      setStep('otp');
      setCountdown(60);
      setCanResend(false);

      // Focus first input after switching to OTP step
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric character
    const val = value.replace(/\D/g, '');
    if (!val) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    const newDigits = [...digits];
    // Handle pasting multiple digits
    if (val.length > 1) {
      const pasted = val.slice(0, 6).split('');
      pasted.forEach((d, i) => {
        if (index + i < 6) newDigits[index + i] = d;
      });
      setDigits(newDigits);
      const nextIdx = Math.min(5, index + pasted.length);
      inputRefs.current[nextIdx]?.focus();
      if (newDigits.every((d) => d !== '')) {
        verifyCode(newDigits.join(''));
      }
      return;
    }

    newDigits[index] = val.slice(-1);
    setDigits(newDigits);

    // Auto-advance cursor
    if (index < 5 && val) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 filled
    if (newDigits.every((d) => d !== '')) {
      verifyCode(newDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyCode = async (code: string) => {
    setError('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          otp: code,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Incorrect verification code. Please check and try again.');
      }

      window.dispatchEvent(new Event('f2s-auth-change'));
      router.push(nextUrl);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      // Clear digits on error so user can re-type
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyCode(digits.join(''));
  };

  if (existingUser) {
    const dest =
      nextUrl && nextUrl !== '/auth' && nextUrl !== '/auth/'
        ? nextUrl
        : existingUser.isOpsOrAdmin
        ? '/admin'
        : existingUser.isOwner
        ? '/owner'
        : '/account/profile';
    const destLabel = existingUser.isOpsOrAdmin
      ? 'Go to Staff & Ops Desk'
      : existingUser.isOwner
      ? 'Go to Owner Dashboard'
      : 'Go to My Profile';

    return (
      <div className="panel" style={{ textAlign: 'center', padding: '36px 24px', borderRadius: '20px' }}>
        <div style={{ fontSize: '44px', marginBottom: '12px' }}>👋</div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--navy)', marginBottom: '8px' }}>
          You&apos;re Already Signed In!
        </h2>
        <p style={{ fontSize: '14.5px', color: 'var(--mut)', marginBottom: '24px' }}>
          Active session for <strong>{existingUser.name || existingUser.phone || 'Verified User'}</strong>.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            type="button"
            className="go"
            onClick={() => router.push(dest)}
            style={{ width: '100%', padding: '14px', borderRadius: '999px', fontSize: '15px', fontWeight: 700 }}
          >
            {destLabel} &rarr;
          </button>
          <button
            type="button"
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              window.dispatchEvent(new Event('f2s-auth-change'));
              setExistingUser(null);
            }}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '999px',
              border: '1.5px solid var(--line)',
              background: '#fff',
              color: 'var(--mut)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            Sign out / Switch Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel" style={{ borderRadius: '20px', padding: 'clamp(22px, 5vw, 32px) clamp(14px, 4vw, 28px)', border: '1px solid var(--line)' }}>
      {step === 'phone' ? (
        <form onSubmit={handleRequestOtp}>
          <h2 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>
            Mobile Verification
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--mut)', marginBottom: '22px', lineHeight: 1.5 }}>
            Enter your mobile number to receive a 6-digit one-time password (OTP).
          </p>

          <label style={{ display: 'grid', gap: '8px', marginBottom: '18px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mut)' }}>
              10-Digit Mobile Number
            </span>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--line)', borderRadius: '12px', background: '#fff', overflow: 'hidden' }}>
              <span style={{ padding: '0 12px', fontWeight: 600, color: 'var(--navy)', borderRight: '1px solid var(--line)', background: 'var(--sky)', fontSize: '14.5px' }}>
                +91
              </span>
              <input
                type="tel"
                placeholder="Enter 10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                autoFocus
                required
                maxLength={10}
                style={{
                  border: 0,
                  fontSize: '16px',
                  fontWeight: 600,
                  padding: '12px 14px',
                  outline: 'none',
                  letterSpacing: '1px',
                  width: '100%',
                }}
              />
            </div>
          </label>

          {error && (
            <p className="msg err" style={{ marginBottom: '14px', fontSize: '13.5px', color: 'var(--red)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="go"
            disabled={loading || phone.replace(/\D/g, '').length !== 10}
            style={{
              width: '100%',
              borderRadius: '999px',
              padding: '14px',
              fontSize: '15.5px',
              fontWeight: 700,
              opacity: loading || phone.replace(/\D/g, '').length !== 10 ? 0.6 : 1,
            }}
          >
            {loading ? 'Sending Code...' : 'Send Verification Code'}
          </button>

          <p style={{ fontSize: '12px', color: 'var(--mut)', marginTop: '20px', lineHeight: 1.6, textAlign: 'center' }}>
            A 6-digit OTP will be dispatched. By proceeding, you agree to Find2Stay&apos;s privacy policy.
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifySubmit}>
          <h2 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>
            Enter 6-Digit Code
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--mut)', marginBottom: '22px' }}>
            Code sent to <strong>{maskedPhone}</strong>
            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setError('');
              }}
              style={{
                color: 'var(--blue)',
                textDecoration: 'underline',
                background: 'none',
                border: 0,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
                marginLeft: '8px',
              }}
            >
              Edit
            </button>
          </p>

          {/* Test/Dev OTP Helper Banner */}
          {devOtp && (
            <div
              style={{
                background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                border: '1.5px solid #818CF8',
                borderRadius: '14px',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.15)',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#4338CA',
                    display: 'block',
                    marginBottom: '2px',
                  }}
                >
                  ⚡ Local Demo Verification Code
                </span>
                <span
                  style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    fontFamily: 'monospace',
                    color: '#312E81',
                    letterSpacing: '4px',
                  }}
                >
                  {devOtp}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const split = devOtp.split('');
                  setDigits(split);
                  verifyCode(devOtp);
                }}
                style={{
                  background: '#4F46E5',
                  color: '#fff',
                  border: 0,
                  borderRadius: '8px',
                  padding: '9px 15px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Click to Auto-Fill &rarr;
              </button>
            </div>
          )}

          {/* 6 Individual Digit Boxes */}
          <div style={{ display: 'flex', gap: 'clamp(4px, 1.5vw, 8px)', justifyContent: 'center', marginBottom: '20px' }}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                style={{
                  width: 'clamp(38px, 11vw, 46px)',
                  height: 'clamp(48px, 13vw, 54px)',
                  textAlign: 'center',
                  fontSize: 'clamp(20px, 5vw, 24px)',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  borderRadius: '10px',
                  border: digit ? '2px solid var(--blue)' : '1.5px solid var(--line)',
                  background: '#fff',
                  outline: 'none',
                  color: 'var(--navy)',
                  padding: 0,
                }}
              />
            ))}
          </div>

          {error && (
            <p className="msg err" style={{ marginBottom: '14px', fontSize: '13.5px', color: 'var(--red)', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="go"
            disabled={loading || digits.some((d) => d === '')}
            style={{
              width: '100%',
              borderRadius: '999px',
              padding: '14px',
              fontSize: '15.5px',
              fontWeight: 700,
              opacity: loading || digits.some((d) => d === '') ? 0.6 : 1,
            }}
          >
            {loading ? 'Verifying Code...' : 'Verify & Continue'}
          </button>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--mut)' }}>
            {canResend ? (
              <button
                type="button"
                onClick={() => handleRequestOtp()}
                style={{
                  color: 'var(--blue)',
                  fontWeight: 700,
                  background: 'none',
                  border: 0,
                  cursor: 'pointer',
                }}
              >
                Resend verification code
              </button>
            ) : (
              <span>Resend code in <strong>0:{countdown < 10 ? `0${countdown}` : countdown}</strong></span>
            )}
          </div>
        </form>
      )}

      {/* Admin and User sign-in clarity footer link */}
      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--line)', textAlign: 'center', fontSize: '13px', color: 'var(--mut)' }}>
        Find2Stay Operations or Admin?{' '}
        <a href="/admin/login" style={{ color: 'var(--blue)', fontWeight: 700, textDecoration: 'underline' }}>
          Staff Desk &amp; Admin Sign In &rarr;
        </a>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <>
      <section className="head">
        <div className="wrap">
          <h1>Sign in with Mobile OTP</h1>
          <p>
            Secure, password-less mobile verification for verified stays across India.
          </p>
        </div>
      </section>

      <div className="wrap narrow" style={{ maxWidth: 460, margin: '24px auto 70px', padding: '0 16px' }}>
        <Suspense fallback={<div className="panel text-center py-8">Loading authentication...</div>}>
          <AuthContent />
        </Suspense>
      </div>
    </>
  );
}
