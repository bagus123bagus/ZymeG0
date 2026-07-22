import { useState, type FormEvent } from 'react';
import { useAuth } from '../lib/auth';

type Mode = 'login' | 'daftar';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);
    if (mode === 'login') {
      const { error: err } = await signIn(email.trim(), password);
      setSubmitting(false);
      if (err) setError(err);
    } else {
      if (!fullName.trim()) {
        setError('Nama lengkap wajib diisi.');
        setSubmitting(false);
        return;
      }
      const { error: err } = await signUp(email.trim(), password, fullName.trim());
      setSubmitting(false);
      if (err) setError(err);
      else setSuccessMsg('Akun berhasil dibuat! Silakan login.');
    }
  }

  function switchMode(m: Mode) {
    setMode(m);
    setError(null);
    setSuccessMsg(null);
  }

  return (
    <div className="login-page">
      {/* Decorative leaves */}
      <svg className="login-leaf-1" viewBox="0 0 100 100" fill="none">
        <path d="M50 5 Q80 25 70 60 Q60 30 30 40 Q40 15 50 5Z" fill="#8fc25f" />
      </svg>
      <svg className="login-leaf-2" viewBox="0 0 100 100" fill="none">
        <path d="M50 5 Q80 25 70 60 Q60 30 30 40 Q40 15 50 5Z" fill="#79b34a" />
      </svg>
      <svg className="login-leaf-3" viewBox="0 0 100 100" fill="none">
        <path d="M50 5 Q80 25 70 60 Q60 30 30 40 Q40 15 50 5Z" fill="#8fc25f" />
      </svg>

      {/* Logo */}
      <div className="login-logo-wrap">
        <svg className="login-logo" viewBox="0 0 100 100">
          <path d="M50 5 C50 5 20 40 20 62 C20 80 33 92 50 92 C67 92 80 80 80 62 C80 40 50 5 50 5Z" fill="#2d6a1f" />
          <circle cx="50" cy="65" r="26" fill="#4a9a2a" />
          <circle cx="55" cy="68" r="12" fill="#f4a020" />
          <circle cx="55" cy="68" r="8" fill="#f4a020" stroke="#e8890a" strokeWidth="1" />
          <line x1="55" y1="60" x2="55" y2="76" stroke="#e8890a" strokeWidth="1" />
          <line x1="47" y1="68" x2="63" y2="68" stroke="#e8890a" strokeWidth="1" />
          <circle cx="40" cy="70" r="8" fill="#6ab52a" />
          <path d="M50 20 Q60 30 55 42 Q50 30 42 35 Q46 22 50 20Z" fill="#8acc40" />
          <circle cx="68" cy="48" r="2" fill="white" opacity="0.9" />
          <circle cx="32" cy="55" r="1.5" fill="white" opacity="0.7" />
        </svg>
        <div className="login-brand">
          Zyme<span>Go</span>
        </div>
        <div className="login-tagline">Ecoenzyme Center</div>
        <div className="login-pill">KUMPULKAN • OLAH • SELAMATKAN</div>
      </div>

      {/* Form card */}
      <div className="login-card">
        <div className="login-tabs">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => switchMode('login')}
          >
            Login
          </button>
          <button
            className={mode === 'daftar' ? 'active' : ''}
            onClick={() => switchMode('daftar')}
          >
            Daftar Akun
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === 'daftar' && (
            <div className="login-field">
              <label>Nama Lengkap</label>
              <div className="login-input-wrap">
                <i className="fa-solid fa-user" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
            </div>
          )}

          <div className="login-field">
            <label>Email / Nomor HP</label>
            <div className="login-input-wrap">
              <i className="fa-solid fa-envelope" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email atau nomor HP"
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label>Password</label>
            <div className="login-input-wrap">
              <i className="fa-solid fa-lock" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
              />
              <button type="button" className="login-eye-btn" onClick={() => setShowPass((s) => !s)}>
                <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>

          {mode === 'login' && (
            <button type="button" className="login-forgot">
              Lupa Password?
            </button>
          )}

          {error && <div className="login-error">{error}</div>}
          {successMsg && <div className="login-success">{successMsg}</div>}

          <button type="submit" className="login-btn" disabled={submitting}>
            {submitting ? (
              <>
                <span className="spin" /> Memproses...
              </>
            ) : mode === 'login' ? (
              'Masuk'
            ) : (
              'Daftar'
            )}
          </button>
        </form>
      </div>

      {/* Illustration */}
      <svg className="login-illustration" viewBox="0 0 300 200" fill="none">
        <ellipse cx="150" cy="180" rx="120" ry="12" fill="#6ea832" opacity="0.2" />
        <path d="M150 170 Q90 140 80 80 Q110 100 140 90 Q120 130 150 170Z" fill="#4a9a2a" />
        <path d="M150 170 Q90 140 80 80 Q110 100 140 90" stroke="#2d6a1f" strokeWidth="1.5" fill="none" />
        <path d="M180 175 Q220 150 230 110 Q205 125 185 120 Q200 145 180 175Z" fill="#6ea832" />
        <rect x="125" y="120" width="50" height="50" rx="6" fill="#3a7a1a" />
        <rect x="120" y="115" width="60" height="8" rx="4" fill="#2d6a1f" />
        <path d="M140 130 L145 140 L138 140 L142 150 M155 130 L150 140 L158 140 L154 150" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="100" cy="140" r="10" fill="#f4a020" />
        <path d="M100 130 Q102 125 105 124" stroke="#2d6a1f" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M210 145 L225 145 L220 165 Z" fill="#f4a020" />
        <path d="M212 145 Q215 138 218 140 M220 145 Q224 138 222 142" stroke="#4a9a2a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="60" cy="60" r="2" fill="#8acc40" />
        <circle cx="240" cy="50" r="2.5" fill="#8acc40" />
        <circle cx="200" cy="80" r="1.5" fill="#6ea832" />
      </svg>

      {/* Footer */}
      <div className="login-footer">
        {mode === 'login' ? (
          <>
            Belum punya akun?{' '}
            <button onClick={() => switchMode('daftar')}>Daftar sekarang</button>
          </>
        ) : (
          <>
            Sudah punya akun?{' '}
            <button onClick={() => switchMode('login')}>Login di sini</button>
          </>
        )}
      </div>
    </div>
  );
}
