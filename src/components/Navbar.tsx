import { useState } from 'react';
import logoImg from './image.png';

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
          <img src={logoImg} alt="ZymeGo" className="header-logo-icon" style={{ borderRadius: 0, background: 'transparent', objectFit: 'contain' }} />
          <span className="header-logo-text">ZymeGo</span>
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
