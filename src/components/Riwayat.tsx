import { useState, useMemo } from 'react';
import type { Page } from './Navbar';

interface Props {
  deposits: any[];
  setPage?: (p: Page) => void;
}

type Filter = 'semua' | 'Buah' | 'Sayuran' | 'Antar' | 'Jemput';

export default function Riwayat({ deposits, setPage }: Props) {
  const [filter, setFilter] = useState<Filter>('semua');

  const filtered = useMemo(() => {
    if (filter === 'semua') return deposits;
    if (filter === 'Buah' || filter === 'Sayuran')
      return deposits.filter((d) => d.jenis_limbah === filter);
    return deposits.filter((d) => d.opsi === filter);
  }, [deposits, filter]);

  const totalKg = deposits.reduce((s, d) => s + Number(d.berat_kg), 0);
  const totalPoin = deposits.reduce((s, d) => s + (d.poin || 0), 0);

  const filters: { id: Filter; label: string; icon: string }[] = [
    { id: 'semua', label: 'Semua', icon: 'fa-list' },
    { id: 'Buah', label: 'Buah', icon: 'fa-apple-whole' },
    { id: 'Sayuran', label: 'Sayuran', icon: 'fa-carrot' },
    { id: 'Antar', label: 'Antar', icon: 'fa-person-walking' },
    { id: 'Jemput', label: 'Jemput', icon: 'fa-truck' },
  ];

  return (
    <section className="view active" data-view="riwayat">
      <div className="page-header">
        <div className="header-accent" />
        <h2>Riwayat Setor</h2>
      </div>

      {deposits.length > 0 && (
        <div className="summary-card">
          <div className="sc-icon">
            <i className="fa-solid fa-recycle" />
          </div>
          <div className="sc-info">
            <h3>{deposits.length}x Setor</h3>
            <p>{totalKg.toFixed(1).replace('.', ',')} kg limbah • {totalPoin} poin</p>
          </div>
          <div className="sc-badge">Total</div>
        </div>
      )}

      {deposits.length > 0 && (
        <div className="filter-chip-row">
          {filters.map((f) => (
            <div
              key={f.id}
              className={`filter-chip${filter === f.id ? ' active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              <i className={`fa-solid ${f.icon}`} style={{ fontSize: '0.7rem' }} />
              {f.label}
            </div>
          ))}
        </div>
      )}

      <div className="history-list stagger">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrap">
              <i className="fa-solid fa-box-open" />
            </div>
            <h3>Belum ada riwayat</h3>
            <p>
              {deposits.length === 0
                ? 'Yuk mulai setor limbah organikmu dan dapatkan poin!'
                : 'Tidak ada riwayat untuk filter ini.'}
            </p>
            {deposits.length === 0 && setPage && (
              <button className="empty-cta" onClick={() => setPage('setor')}>
                <i className="fa-solid fa-recycle" style={{ marginRight: '0.4rem' }} />
                Setor Sekarang
              </button>
            )}
          </div>
        ) : (
          filtered.map((d, i) => (
            <div className="history-item" key={d.id} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="history-icon">
                <i className={`fa-solid ${d.jenis_limbah === 'Buah' ? 'fa-apple-whole' : 'fa-carrot'}`} />
              </div>
              <div className="history-info">
                <h4>{d.jenis_limbah === 'Buah' ? 'Limbah Buah' : 'Limbah Sayuran'}</h4>
                <p>
                  {new Date(d.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}{' '}
                  • {d.opsi === 'Jemput' ? '🚗 Jemput' : '🚶 Antar'}
                </p>
                {d.keterangan && (
                  <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{d.keterangan}</p>
                )}
                <span className={`history-status ${d.status === 'Selesai' ? 'selesai' : 'diproses'}`}>
                  <i className={`fa-solid ${d.status === 'Selesai' ? 'fa-check' : 'fa-clock'}`} style={{ fontSize: '0.55rem' }} />
                  {d.status || 'Diproses'}
                </span>
              </div>
              <div className="history-right">
                <div className="kg">{Number(d.berat_kg).toFixed(1).replace('.', ',')} kg</div>
                <div className="poin">+{d.poin} poin</div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
