import { useState } from 'react';

export type Page = 'beranda' | 'riwayat' | 'setor' | 'poin' | 'profil' | 'edukasi' | 'monitoring';

interface Props {
  page: Page;
  setPage: (p: Page) => void;
  notifCount: number;
  onBellClick: () => void;
}

export default function Navbar({ page, setPage, notifCount, onBellClick }: Props) {
  const [bellRinging, setBellRinging] = useState(false);

  function handleBell() {
    setBellRinging(true);
    setTimeout(() => setBellRinging(false), 600);
    onBellClick();
  }

  return (
    <>
      <header className="topbar">
        <div className="brand-mini" onClick={() => setPage('beranda')}>
          <svg className="header-logo-icon" viewBox="0 0 100 100">
            <path d="M50 5 C50 5 20 40 20 62 C20 80 33 92 50 92 C67 92 80 80 80 62 C80 40 50 5 50 5Z" fill="#2d6a1f" />
            <circle cx="50" cy="65" r="26" fill="#4a9a2a" />
            <circle cx="55" cy="68" r="12" fill="#f4a020" />
            <circle cx="40" cy="70" r="8" fill="#6ab52a" />
            <path d="M50 20 Q60 30 55 42 Q50 30 42 35 Q46 22 50 20Z" fill="#8acc40" />
          </svg>
          <div className="header-logo">
            Zyme<span>Go</span>
          </div>
        </div>
        <div className="topbar-actions">
          <button className={`icon-btn${bellRinging ? ' ringing' : ''}`} onClick={handleBell} aria-label="Notifikasi">
            <i className="fa-solid fa-bell" />
            {notifCount > 0 && <span className="badge">{notifCount}</span>}
          </button>
          <button className="avatar-btn" onClick={() => setPage('profil')} aria-label="Profil">
            <i className="fa-solid fa-user" />
          </button>
        </div>
      </header>

      <nav className="bottom-nav">
        <button
          className={`nav-item${page === 'beranda' ? ' active' : ''}`}
          onClick={() => setPage('beranda')}
        >
          <i className="fa-solid fa-house" />
          Beranda
        </button>
        <button
          className={`nav-item${page === 'riwayat' ? ' active' : ''}`}
          onClick={() => setPage('riwayat')}
        >
          <i className="fa-regular fa-clock" />
          Riwayat
        </button>
        <div className="nav-item fab-wrap">
          <div className="nav-fab" onClick={() => setPage('setor')}>
            <i className="fa-solid fa-recycle" />
          </div>
          <div className="nav-fab-label">Setor</div>
        </div>
        <button
          className={`nav-item${page === 'poin' ? ' active' : ''}`}
          onClick={() => setPage('poin')}
        >
          <i className="fa-regular fa-star" />
          Poin
        </button>
        <button
          className={`nav-item${page === 'profil' ? ' active' : ''}`}
          onClick={() => setPage('profil')}
        >
          <i className="fa-regular fa-user" />
          Profil
        </button>
      </nav>
    </>
  );
}


