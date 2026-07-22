import { useState, type FormEvent } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';

interface Props {
  totalPoin: number;
  totalKg: number;
  totalSetor: number;
  onSignOut: () => void;
  onToast: (msg: string, icon?: string) => void;
}

type ModalKind = 'edit' | 'password' | 'about' | null;

function levelInfo(poin: number) {
  const thresholds = [0, 100, 300, 600, 1000, 1500, 2200];
  let lvl = 1;
  for (let i = 1; i < thresholds.length; i++) {
    if (poin >= thresholds[i]) lvl = i + 1;
    else break;
  }
  const curBase = thresholds[lvl - 1];
  const nextBase = thresholds[lvl] !== undefined ? thresholds[lvl] : curBase + 700;
  const progress = Math.min(100, ((poin - curBase) / (nextBase - curBase)) * 100);
  const remaining = Math.max(0, nextBase - poin);
  return { lvl, progress, remaining, nextLvl: lvl + 1 };
}

export default function Profil({ totalPoin, totalKg, totalSetor, onSignOut, onToast }: Props) {
  const { profile, user, signOut, refreshProfile } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [modal, setModal] = useState<ModalKind>(null);

  const name = profile?.full_name || 'Pengguna';
  const email = user?.email || '';
  const initial = name.charAt(0).toUpperCase() || 'U';
  const info = levelInfo(totalPoin);

  function toggleDark() {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
  }

  function closeModal() {
    setModal(null);
  }

  return (
    <section className="view active" data-view="profil">
      <div className="page-header">
        <div className="header-accent" />
        <h2>Profil</h2>
      </div>
      <div className="profile-hero">
        <div className="profile-avatar">
          {initial}
          <div className="edit-dot" onClick={() => setModal('edit')}>
            <i className="fa-solid fa-camera" />
          </div>
        </div>
        <h2>{name}</h2>
        <p>{email}</p>
        <div className="badge-emblem">
          <i className="fa-solid fa-medal" /> Eco Warrior · Level {info.lvl}
        </div>
        <div className="level-progress">
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${info.progress}%` }} />
          </div>
          <p>{info.remaining} poin lagi menuju Level {info.nextLvl} 🌿</p>
        </div>
      </div>
      <div className="profile-stats">
        <div className="pstat">
          <div className="num">{totalSetor}x</div>
          <div className="lbl">Total Setor</div>
        </div>
        <div className="pstat">
          <div className="num">{totalKg.toFixed(1).replace('.', ',')} kg</div>
          <div className="lbl">Total Limbah</div>
        </div>
        <div className="pstat">
          <div className="num">{totalPoin}</div>
          <div className="lbl">Total Poin</div>
        </div>
      </div>
      <div className="profile-menu stagger">
        <div className="pmenu-item" onClick={() => setModal('edit')}>
          <div className="pm-icon">
            <i className="fa-solid fa-user-pen" />
          </div>
          <span>Edit Profil</span>
          <i className="fa-solid fa-chevron-right chev" />
        </div>
        <div className="pmenu-item" onClick={() => setModal('password')}>
          <div className="pm-icon">
            <i className="fa-solid fa-lock" />
          </div>
          <span>Ubah Kata Sandi</span>
          <i className="fa-solid fa-chevron-right chev" />
        </div>
        <div className="pmenu-item">
          <div className="pm-icon">
            <i className="fa-solid fa-moon" />
          </div>
          <span>Mode Gelap</span>
          <label className="switch">
            <input type="checkbox" checked={darkMode} onChange={toggleDark} />
            <span className="slider" />
          </label>
        </div>
        <div className="pmenu-item" onClick={() => setModal('about')}>
          <div className="pm-icon">
            <i className="fa-solid fa-circle-info" />
          </div>
          <span>Tentang Aplikasi</span>
          <i className="fa-solid fa-chevron-right chev" />
        </div>
        <div
          className="pmenu-item danger"
          onClick={() => {
            signOut();
            onSignOut();
          }}
        >
          <div className="pm-icon">
            <i className="fa-solid fa-right-from-bracket" />
          </div>
          <span>Keluar</span>
          <i className="fa-solid fa-chevron-right chev" />
        </div>
      </div>
      <div className="app-version">ZymeGo EcoEnzyme Center · v1.0.0</div>

      {modal === 'edit' && (
        <EditProfilModal
          profile={profile}
          userId={user?.id || ''}
          onClose={closeModal}
          onSaved={() => {
            refreshProfile();
            onToast('Profil berhasil diperbarui!', 'fa-circle-check');
            closeModal();
          }}
        />
      )}
      {modal === 'password' && (
        <UbahSandiModal
          onClose={closeModal}
          onSaved={() => {
            onToast('Kata sandi berhasil diubah!', 'fa-circle-check');
            closeModal();
          }}
        />
      )}
      {modal === 'about' && <TentangModal onClose={closeModal} />}
    </section>
  );
}

/* ---------- Edit Profil Modal ---------- */
function EditProfilModal({
  profile,
  userId,
  onClose,
  onSaved,
}: {
  profile: { full_name: string; phone: string; address: string } | null;
  userId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!fullName.trim()) {
      setError('Nama lengkap tidak boleh kosong.');
      return;
    }
    setSubmitting(true);
    const { error: updErr } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
      })
      .eq('id', userId);
    setSubmitting(false);
    if (updErr) {
      setError(updErr.message);
      return;
    }
    onSaved();
  }

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-sheet" style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <i className="fa-solid fa-xmark" />
        </button>
        <div className="sheet-handle" />
        <h2 className="modal-title">Edit Profil</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-field">
            <label>Nama Lengkap</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masukkan nama lengkap"
            />
          </div>
          <div className="modal-field">
            <label>Nomor HP</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Contoh: 08123456789"
            />
          </div>
          <div className="modal-field">
            <label>Alamat</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Masukkan alamat lengkap"
              rows={3}
            />
          </div>
          {error && <div className="modal-error">{error}</div>}
          <button type="submit" className={`btn-submit${submitting ? ' loading' : ''}`} disabled={submitting}>
            <span className="btn-label">{submitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            <span className="spin" />
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------- Ubah Kata Sandi Modal ---------- */
function UbahSandiModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!current || !next || !confirm) {
      setError('Semua kolom wajib diisi.');
      return;
    }
    if (next.length < 6) {
      setError('Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (next !== confirm) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    setSubmitting(true);
    const { error: updErr } = await supabase.auth.updateUser({
      password: next,
    });
    setSubmitting(false);
    if (updErr) {
      setError(updErr.message);
      return;
    }
    onSaved();
  }

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-sheet" style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <i className="fa-solid fa-xmark" />
        </button>
        <div className="sheet-handle" />
        <h2 className="modal-title">Ubah Kata Sandi</h2>
        <p className="modal-subtitle">Masukkan kata sandi lama dan kata sandi baru untuk mengamankan akunmu.</p>
        <form onSubmit={handleSubmit}>
          <div className="modal-field">
            <label>Kata Sandi Saat Ini</label>
            <div className="login-input-wrap">
              <i className="fa-solid fa-lock" />
              <input
                type={showCurrent ? 'text' : 'password'}
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="Masukkan kata sandi lama"
              />
              <button type="button" className="login-eye-btn" onClick={() => setShowCurrent((s) => !s)}>
                <i className={`fa-solid ${showCurrent ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>
          <div className="modal-field">
            <label>Kata Sandi Baru</label>
            <div className="login-input-wrap">
              <i className="fa-solid fa-key" />
              <input
                type={showNew ? 'text' : 'password'}
                value={next}
                onChange={(e) => setNext(e.target.value)}
                placeholder="Minimal 6 karakter"
              />
              <button type="button" className="login-eye-btn" onClick={() => setShowNew((s) => !s)}>
                <i className={`fa-solid ${showNew ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>
          <div className="modal-field">
            <label>Konfirmasi Kata Sandi Baru</label>
            <div className="login-input-wrap">
              <i className="fa-solid fa-key" />
              <input
                type={showNew ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Ulangi kata sandi baru"
              />
            </div>
          </div>
          {error && <div className="modal-error">{error}</div>}
          <button type="submit" className={`btn-submit${submitting ? ' loading' : ''}`} disabled={submitting}>
            <span className="btn-label">{submitting ? 'Memproses...' : 'Ubah Kata Sandi'}</span>
            <span className="spin" />
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------- Tentang Aplikasi Modal ---------- */
function TentangModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-sheet" style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <i className="fa-solid fa-xmark" />
        </button>
        <div className="sheet-handle" />
        <svg className="about-logo" viewBox="0 0 100 100">
          <path d="M50 5 C50 5 20 40 20 62 C20 80 33 92 50 92 C67 92 80 80 80 62 C80 40 50 5 50 5Z" fill="#2d6a1f" />
          <circle cx="50" cy="65" r="26" fill="#4a9a2a" />
          <circle cx="55" cy="68" r="12" fill="#f4a020" />
          <circle cx="40" cy="70" r="8" fill="#6ab52a" />
          <path d="M50 20 Q60 30 55 42 Q50 30 42 35 Q46 22 50 20Z" fill="#8acc40" />
        </svg>
        <h2 style={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-dark)' }}>
          ZymeGo
        </h2>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
          Ecoenzyme Center
        </p>
        <p className="modal-subtitle" style={{ textAlign: 'center' }}>
          ZymeGo adalah platform pengelolaan limbah organik yang mengubah limbah dapur menjadi eco-enzyme dan poin reward. Kumpulkan, olah, dan selamatkan bumi!
        </p>
        <div style={{ marginBottom: '1.2rem' }}>
          <div className="about-feature">
            <i className="fa-solid fa-recycle" />
            <div>
              <h5>Setor Limbah</h5>
              <p>Catat setoran limbah buah dan sayuran, dapatkan poin otomatis.</p>
            </div>
          </div>
          <div className="about-feature">
            <i className="fa-solid fa-gift" />
            <div>
              <h5>Tukar Poin</h5>
              <p>Tukarkan poin dengan produk ramah lingkungan dan voucher.</p>
            </div>
          </div>
          <div className="about-feature">
            <i className="fa-solid fa-book-open" />
            <div>
              <h5>Edukasi</h5>
              <p>Pelajari cara membuat dan memanfaatkan eco-enzyme.</p>
            </div>
          </div>
          <div className="about-feature">
            <i className="fa-solid fa-chart-simple" />
            <div>
              <h5>Monitoring</h5>
              <p>Pantau kontribusi limbah dan dampak lingkunganmu.</p>
            </div>
          </div>
        </div>
        <div className="about-version">ZymeGo v1.0.0 · Ecoenzyme Center</div>
      </div>
    </div>
  );
}
