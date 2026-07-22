import { useState } from 'react';

const articles = [
  {
    title: 'Apa Itu Eco-Enzyme?',
    category: 'apa-itu',
    thumb: 'thumb-1',
    icon: 'fa-bowl-food',
    body: 'Eco-enzyme adalah cairan hasil fermentasi limbah organik seperti kulit buah dan sayur dengan gula dan air. Cairan ini kaya manfaat, mulai dari pembersih alami hingga pupuk tanaman, dan menjadi salah satu cara sederhana mengurangi sampah organik rumah tangga.',
  },
  {
    title: 'Manfaat Eco-Enzyme untuk Kehidupan',
    category: 'manfaat',
    thumb: 'thumb-3',
    icon: 'fa-seedling',
    body: 'Eco-enzyme memiliki banyak manfaat, antara lain: sebagai pupuk cair alami untuk tanaman, pembersih rumah ramah lingkungan, pengurai limbah organik, mengurangi bau, dan membantu menjaga keseimbangan ekosistem.',
  },
  {
    title: 'Cara Membuat Eco-Enzyme',
    category: 'tips',
    thumb: 'thumb-2',
    icon: 'fa-bottle-droplet',
    body: 'Campurkan 1 bagian gula merah/molase, 3 bagian limbah kulit buah/sayur, dan 10 bagian air ke dalam wadah tertutup. Fermentasikan selama kurang lebih 3 bulan, buka tutup wadah secara berkala untuk melepas gas. Setelah matang, saring dan cairan siap digunakan.',
  },
  {
    title: 'Eco-Enzyme untuk Pembersih Rumah',
    category: 'tips',
    thumb: 'thumb-4',
    icon: 'fa-droplet',
    body: 'Selain untuk tanaman, eco-enzyme juga efektif sebagai cairan pembersih lantai, kaca, dan area dapur. Sifatnya yang alami membuatnya aman digunakan sehari-hari dan ramah terhadap lingkungan dibandingkan bahan pembersih kimia biasa.',
  },
  {
    title: 'Mengurangi Sampah Rumah Tangga',
    category: 'tips',
    thumb: 'thumb-6',
    icon: 'fa-recycle',
    body: 'Memilah sampah organik dan anorganik dari rumah adalah langkah awal yang penting. Dengan menyetor limbah organik ke ZymeGo, kamu turut mengurangi volume sampah ke TPA sekaligus mendapatkan poin yang bisa ditukar reward.',
  },
  {
    title: 'Layanan Konsultasi ZymeGo',
    category: 'layanan',
    thumb: 'thumb-5',
    icon: 'fa-handshake',
    body: 'ZymeGo menyediakan layanan konsultasi untuk membantu Anda mengelola limbah organik dengan lebih baik. Hubungi kami untuk informasi lebih lanjut tentang pengolahan eco-enzyme yang efektif.',
  },
];

const chips = [
  { id: 'semua', label: 'Semua' },
  { id: 'apa-itu', label: 'Apa Itu' },
  { id: 'manfaat', label: 'Manfaat' },
  { id: 'tips', label: 'Tips' },
  { id: 'layanan', label: 'Layanan' },
];

export default function Edukasi() {
  const [active, setActive] = useState('semua');
  const [openArticle, setOpenArticle] = useState<(typeof articles)[0] | null>(null);

  const filtered = active === 'semua' ? articles : articles.filter((a) => a.category === active);

  return (
    <section className="view active" data-view="edukasi">
      <div className="page-header">
        <div className="header-accent" />
        <h2>Edukasi</h2>
      </div>
      <div className="chip-row">
        {chips.map((c) => (
          <div
            key={c.id}
            className={`chip${active === c.id ? ' active' : ''}`}
            onClick={() => setActive(c.id)}
          >
            {c.label}
          </div>
        ))}
      </div>
      <div className="section article-grid stagger" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        {filtered.map((a, i) => (
          <div
            className="article-card"
            key={i}
            style={{ animationDelay: `${i * 0.05}s` }}
            onClick={() => setOpenArticle(a)}
          >
            <div className={`article-thumb ${a.thumb}`}>
              <i className={`fa-solid ${a.icon}`} />
            </div>
            <div className="article-body">
              <h4>{a.title}</h4>
              <p>{a.body.substring(0, 80)}{a.body.length > 80 ? '...' : ''}</p>
              <div className="article-date">
                <i className="fa-solid fa-tag" /> {a.category}
              </div>
            </div>
          </div>
        ))}
      </div>

      {openArticle && (
        <div className="modal-overlay active" onClick={() => setOpenArticle(null)}>
          <div className="modal-sheet" style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpenArticle(null)}>
              <i className="fa-solid fa-xmark" />
            </button>
            <div className="sheet-handle" />
            <div
              className={`article-thumb ${openArticle.thumb}`}
              style={{ borderRadius: 14, height: 150, fontSize: '2.2rem', marginBottom: '1rem' }}
            >
              <i className={`fa-solid ${openArticle.icon}`} />
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.9rem' }}>{openArticle.title}</h2>
            <p style={{ fontSize: '0.86rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>{openArticle.body}</p>
          </div>
        </div>
      )}
    </section>
  );
}
