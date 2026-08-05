import type { Page } from './Navbar';

interface Props {
  setPage: (p: Page) => void;
  totalPoin: number;
  totalKg: number;
  userName: string;
  userEmail: string;
  pendingCount: number;
}

const menuItems: { id: Page; label: string; icon: string; cls: string }[] = [
  { id: 'edukasi', label: 'Edukasi', icon: 'fa-book-open', cls: 'mi-edukasi' },
  { id: 'setor', label: 'Setor Limbah', icon: 'fa-recycle', cls: 'mi-setor' },
  { id: 'poin', label: 'Reward', icon: 'fa-gift', cls: 'mi-reward' },
  { id: 'monitoring', label: 'Monitoring', icon: 'fa-chart-simple', cls: 'mi-monitoring' },
];

export default function Beranda({ setPage, totalPoin, totalKg, userName, userEmail, pendingCount }: Props) {
  return (
    <section className="view active" data-view="beranda">
      {/* Greeting */}
      <div className="greeting-wrap">
        <svg className="leaf-deco" viewBox="0 0 150 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M142 10C112 19 93 36 87 67" stroke="#5b9c36" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M116 27C101 19 91 20 82 25C94 34 105 35 116 27Z" fill="#8fc25f" />
          <path d="M103 45C88 38 77 41 69 49C82 54 93 53 103 45Z" fill="#72b34b" />
          <path d="M98 64C84 59 75 63 68 72C80 76 91 73 98 64Z" fill="#a4d477" />
          <circle cx="124" cy="18" r="4" fill="#f1b33b" opacity="0.8" />
        </svg>
        <h1>
          Halo, {userName} <span className="wave">👋</span>
        </h1>
        <p>Selamat datang di ZymeGo!</p>
        {userEmail && <div className="user-email">{userEmail}</div>}
      </div>

      {pendingCount > 0 && (
        <div className="pending-banner" onClick={() => setPage('riwayat')}>
          <i className="fa-solid fa-clock" />
          <div className="pending-text">
            <strong>{pendingCount} setoran menunggu konfirmasi admin</strong>
            <span>Klik untuk melihat detail</span>
          </div>
          <i className="fa-solid fa-chevron-right" />
        </div>
      )}

      {/* Stats card */}
      <div className="stats-card">
        <i className="fa-solid fa-recycle recycle-watermark" />
        <div className="stat-col">
          <div className="stat-label">Poin Saya</div>
          <div className="stat-value">
            <div className="coin-icon">
              <i className="fa-solid fa-star" />
            </div>
            <span>{totalPoin}</span> <span className="unit">poin</span>
          </div>
          <button className="stat-detail-btn" onClick={() => setPage('poin')}>
            Lihat Detail <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
        <div className="stat-col">
          <div className="stat-label">Total Limbah Terkumpul Bulan Ini</div>
          <div className="stat-value">
            <span>{totalKg.toFixed(1).replace('.', ',')}</span> <span className="unit">kg</span>
          </div>
          <button className="stat-detail-btn" onClick={() => setPage('monitoring')}>
            Lihat Detail <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      </div>

      {/* Menu */}
      <div className="section">
        <div className="section-title">Menu Utama</div>
        <div className="menu-grid stagger">
          {menuItems.map((it, i) => (
            <div
              key={it.id}
              className="menu-item"
              style={{ animationDelay: `${0.05 * (i + 1)}s` }}
              onClick={() => setPage(it.id)}
            >
              <div className={`menu-icon ${it.cls}`}>
                <i className={`fa-solid ${it.icon}`} />
              </div>
              <span>{it.label}</span>
            </div>
          ))}
          <div
            className="menu-item"
            style={{ animationDelay: '0.25s' }}
            onClick={() => window.open('https://forms.gle/7vCoTkTkw6sqrSFK9', '_blank')}
          >
            <div className="menu-icon mi-kuesioner">
              <i className="fa-solid fa-clipboard-list" />
            </div>
            <span>Kuesioner</span>
          </div>
        </div>
      </div>

      {/* Promo banner */}
      <div className="promo-banner" onClick={() => setPage('setor')}>
        <div className="promo-text">
          <h3>Yuk, Ubah Limbah Jadi Manfaat!</h3>
          <p>Setor limbah organikmu dan dapatkan poin serta berbagai reward menarik.</p>
          <button className="promo-btn">
            Setor Sekarang <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
        <svg viewBox="0 0 120 120" width="38%" style={{ maxWidth: 150, flexShrink: 0 }}>
          <ellipse cx="60" cy="100" rx="40" ry="6" fill="#4a9a2a" opacity="0.2" />
          <rect x="35" y="50" width="50" height="50" rx="8" fill="#4a9a2a" />
          <rect x="30" y="42" width="60" height="10" rx="5" fill="#2d6a1f" />
          <path d="M50 65 L55 75 L48 75 L52 85 M65 65 L60 75 L68 75 L64 85" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="30" cy="40" r="10" fill="#f4a020" />
          <path d="M30 32 Q32 27 35 26" stroke="#2d6a1f" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M88 34c8-9 17-7 21 1-8 5-15 5-21-1Z" fill="#8fc25f" />
          <path d="M93 31c-2-7 2-12 8-14 2 7-1 12-8 14Z" fill="#4a9a2a" />
        </svg>
      </div>

      {/* Articles */}
      <div className="section" style={{ marginBottom: 0 }}>
        <div className="section-title">
          Artikel Terbaru
          <a onClick={() => setPage('edukasi')}>
            Lihat Semua <i className="fa-solid fa-chevron-right" />
          </a>
        </div>
        <div className="article-scroll">
          <div className="article-card">
            <div className="article-thumb thumb-1">
              <i className="fa-solid fa-bowl-food" />
            </div>
            <div className="article-body">
              <h4>Apa Itu Eco-Enzyme?</h4>
              <p>Kenali eco-enzyme dan manfaatnya bagi lingkungan dan kehidupan sehari-hari.</p>
            </div>
          </div>
          <div className="article-card">
            <div className="article-thumb thumb-2">
              <i className="fa-solid fa-bottle-droplet" />
            </div>
            <div className="article-body">
              <h4>Cara Membuat Eco-Enzyme</h4>
              <p>Panduan lengkap membuat eco-enzyme dari limbah buah di rumah.</p>
            </div>
          </div>
          <div className="article-card">
            <div className="article-thumb thumb-3">
              <i className="fa-solid fa-seedling" />
            </div>
            <div className="article-body">
              <h4>Manfaat Eco-Enzyme untuk Tanaman</h4>
              <p>Gunakan eco-enzyme untuk menyuburkan tanaman secara alami.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
