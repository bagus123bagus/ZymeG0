import type { Page } from './Navbar';

interface Props {
  setPage: (p: Page) => void;
  totalPoin: number;
  totalKg: number;
  userName: string;
  userEmail: string;
}

const menuItems: { id: Page; label: string; icon: string; cls: string }[] = [
  { id: 'edukasi', label: 'Edukasi', icon: 'fa-book-open', cls: 'mi-edukasi' },
  { id: 'setor', label: 'Setor Limbah', icon: 'fa-recycle', cls: 'mi-setor' },
  { id: 'poin', label: 'Reward', icon: 'fa-gift', cls: 'mi-reward' },
  { id: 'monitoring', label: 'Monitoring', icon: 'fa-chart-simple', cls: 'mi-monitoring' },
];

export default function Beranda({ setPage, totalPoin, totalKg, userName, userEmail }: Props) {
  return (
    <section className="view active" data-view="beranda">
      {/* Greeting */}
      <div className="greeting-wrap">
        <svg className="leaf-deco" viewBox="0 0 150 120" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M140 10 q-30 5-45 25 q20-5 40 0 q-25 5-35 25 q18-2 30 6 q-20 4-25 18"
            stroke="#79b34a"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity="0.55"
          />
          <ellipse cx="118" cy="22" rx="9" ry="5" fill="#8fc25f" opacity="0.7" transform="rotate(30 118 22)" />
          <ellipse cx="100" cy="42" rx="9" ry="5" fill="#79b34a" opacity="0.6" transform="rotate(-10 100 42)" />
          <ellipse cx="112" cy="60" rx="8" ry="4.5" fill="#8fc25f" opacity="0.55" transform="rotate(20 112 60)" />
        </svg>
        <h1>
          Halo, {userName} <span className="wave">👋</span>
        </h1>
        <p>Selamat datang di ZymeGo!</p>
        {userEmail && <div className="user-email">{userEmail}</div>}
      </div>

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
            onClick={() => window.open('https://forms.gle/zymego-kuesioner', '_blank')}
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
          <circle cx="90" cy="35" r="8" fill="#6ab52a" />
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
