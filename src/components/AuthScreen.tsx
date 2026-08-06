import { useState, type FormEvent } from 'react';
import { useAuth } from '../lib/auth';
import logoImg from './image.png';

type Mode = 'login' | 'daftar';
type LoginMethod = 'email' | 'phone';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
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
      const identifier = loginMethod === 'email' ? email.trim() : phone.trim();
      const { error: err } = await signIn(identifier, password, loginMethod);
      setSubmitting(false);
      if (err) setError(err);
    } else {
      if (!fullName.trim()) {
        setError('Nama lengkap wajib diisi.');
        setSubmitting(false);
        return;
      }
      if (!phone.trim()) {
        setError('Nomor telepon wajib diisi.');
        setSubmitting(false);
        return;
      }
      const { error: err } = await signUp(email.trim(), password, fullName.trim(), phone.trim());
      setSubmitting(false);
      if (err) {
        setError(err);
      } else {
        setSuccessMsg('Akun berhasil dibuat! Silakan login dengan data akun kamu.');
        setMode('login');
      }
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
        <img src={logoImg} alt="ZymeGo" className="login-logo" style={{ borderRadius: 0, background: 'transparent', objectFit: 'contain' }} />
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

        {mode === 'login' && (
          <div className="login-method-switch" role="tablist" aria-label="Metode masuk">
            <button type="button" className={loginMethod === 'email' ? 'active' : ''} onClick={() => setLoginMethod('email')}>
              <i className="fa-solid fa-envelope" /> Email
            </button>
            <button type="button" className={loginMethod === 'phone' ? 'active' : ''} onClick={() => setLoginMethod('phone')}>
              <i className="fa-solid fa-phone" /> Nomor HP
            </button>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === 'daftar' && (
            <>
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
              <div className="login-field">
                <label>Nomor Telepon</label>
                <div className="login-input-wrap">
                  <i className="fa-solid fa-phone" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {mode === 'daftar' || loginMethod === 'email' ? (
            <div className="login-field">
              <label>Email <span className="optional-label">(opsional)</span></label>
              <div className="login-input-wrap">
                <i className="fa-solid fa-envelope" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Boleh dikosongkan"
                  required={mode === 'login'}
                />
              </div>
            </div>
          ) : (
            <div className="login-field">
              <label>Nomor HP</label>
              <div className="login-input-wrap">
                <i className="fa-solid fa-phone" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  required
                />
              </div>
            </div>
          )}

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

      <div className="login-illustration" aria-hidden="true">
        <svg viewBox="0 0 320 180" fill="none">
          <ellipse cx="160" cy="164" rx="92" ry="10" fill="#2f6b1f" opacity="0.14" />
          <path d="M58 145C40 122 46 94 72 80C70 106 80 121 96 132" stroke="#5b9c36" strokeWidth="7" strokeLinecap="round" />
          <path d="M264 145C282 122 276 94 250 80C252 106 242 121 226 132" stroke="#5b9c36" strokeWidth="7" strokeLinecap="round" />
          <path d="M66 91C50 82 49 65 59 54C75 62 78 78 66 91Z" fill="#79b34a" />
          <path d="M254 91C270 82 271 65 261 54C245 62 242 78 254 91Z" fill="#79b34a" />
          <rect x="103" y="62" width="114" height="94" rx="20" fill="#3f861f" />
          <rect x="94" y="52" width="132" height="18" rx="9" fill="#245d13" />
          <rect x="142" y="40" width="36" height="13" rx="6.5" fill="#245d13" />
          <path d="M129 86V132M160 86V132M191 86V132" stroke="#8fc25f" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
          <circle cx="160" cy="110" r="25" fill="#2f6b1f" stroke="#8fc25f" strokeWidth="3" />
          <path d="M160 91C151 91 146 97 146 104M145 103L137 102L142 110M175 104C175 113 168 119 160 119M173 120L181 121L176 113" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="91" cy="40" r="4" fill="#f0a83b" />
          <circle cx="232" cy="30" r="3" fill="#f0a83b" />
        </svg>
      </div>

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
