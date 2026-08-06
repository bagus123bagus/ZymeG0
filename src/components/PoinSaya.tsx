import { useEffect, useState } from 'react';
import { supabase, type Reward, type Redemption } from '../lib/supabase';
import { useAuth } from '../lib/auth';

// Map reward names to their image files (place files in /public/)
const rewardImages: Record<string, string> = {
  'Cairan Pel Lantai': 'https://images.pexels.com/photos/12997254/pexels-photo-12997254.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
  'Sabun Cuci Piring': 'https://images.pexels.com/photos/12997255/pexels-photo-12997255.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
  'Pupuk Cair Organik': 'https://images.pexels.com/photos/11730662/pexels-photo-11730662.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
};

const rewardIcons: Record<string, string> = {
  'Sabun Cuci Piring': 'fa-hand-sparkles',
  'Cairan Pel Lantai': 'fa-bucket',
  'Pupuk Cair Organik': 'fa-seedling',
  'Voucher Belanja ZymeGo Rp5.000': 'fa-ticket',
};

interface Props {
  totalPoin: number;
  deposits: any[];
  redemptions: any[];
  onRedeemed: (r: Redemption) => void;
}

export default function PoinSaya({ totalPoin, deposits, redemptions, onRedeemed }: Props) {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [tab, setTab] = useState<'reward' | 'riwayat'>('reward');
  const [selected, setSelected] = useState<Reward | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Reward | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('rewards')
        .select('id, nama, deskripsi, poin_dibutuhkan, ikon, kategori')
        .order('poin_dibutuhkan', { ascending: true });
      setRewards((data as Reward[]) || []);
    })();
  }, []);

  async function handleRedeem() {
    if (!user || !selected) return;
    if (totalPoin < selected.poin_dibutuhkan) {
      setError('Poin Anda tidak cukup.');
      return;
    }
    setSubmitting(true);
    setError(null);
    const { data, error: insErr } = await supabase
      .from('redemptions')
      .insert({
        user_id: user.id,
        reward_id: selected.id,
        nama_reward: selected.nama,
        poin_digunakan: selected.poin_dibutuhkan,
      })
      .select('id, user_id, reward_id, nama_reward, poin_digunakan, status, created_at')
      .maybeSingle();
    setSubmitting(false);
    if (insErr || !data) {
      setError(insErr?.message || 'Gagal menukar poin.');
      return;
    }
    setDone(selected);
    onRedeemed(data as Redemption);
    setSelected(null);
  }

  const totalKg = deposits.reduce((s, d) => s + Number(d.berat_kg), 0);

  function RewardImg({ nama, size = 56 }: { nama: string; size?: number }) {
    const [imgErr, setImgErr] = useState(false);
    if (nama === 'Voucher Belanja ZymeGo Rp5.000') {
      return (
        <div className="voucher-logo" aria-label="Logo voucher ZymeGo">
          <span className="voucher-logo-mark"><i className="fa-solid fa-leaf" /></span>
          <span className="voucher-logo-word">Zyme<span>Go</span></span>
          <small>VOUCHER</small>
        </div>
      );
    }
    const src = rewardImages[nama];
    if (src && !imgErr) {
      return (
        <img
          src={src}
          alt={nama}
          onError={() => setImgErr(true)}
          style={{ width: size, height: size, objectFit: 'contain', borderRadius: 8 }}
        />
      );
    }
    return <i className={`fa-solid ${rewardIcons[nama] || 'fa-gift'}`} />;
  }

  return (
    <section className="view active" data-view="poin">
      <div className="page-header">
        <div className="header-accent" />
        <h2>Poin Saya</h2>
      </div>
      <div className="poin-hero">
        <i className="fa-solid fa-star bg-star" />
        <div className="label">Total Poin Kamu</div>
        <div className="value">{totalPoin}</div>
        <div className="sub">Tukarkan poinmu dengan reward menarik</div>
      </div>

      <div className="konversi-card">
        <span className="label">
          <i className="fa-solid fa-coins" style={{ marginRight: '0.3rem' }} /> Konversi Harga
        </span>
        <span className="value">{totalKg.toFixed(1).replace('.', ',')} kg = Rp{(totalKg * 500).toLocaleString('id-ID')}</span>
      </div>

      <div className="tab-switch">
        <button className={tab === 'reward' ? 'active' : ''} onClick={() => setTab('reward')}>
          Tukar Poin
        </button>
        <button className={tab === 'riwayat' ? 'active' : ''} onClick={() => setTab('riwayat')}>
          Riwayat Poin
        </button>
      </div>

      {tab === 'reward' ? (
        <div className="reward-grid stagger">
          {rewards.map((r, i) => {
            const can = totalPoin >= r.poin_dibutuhkan;
            return (
              <div className="reward-card" key={r.id} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="reward-icon">
                  <RewardImg nama={r.nama} />
                </div>
                <h4>{r.nama}</h4>
                <div className="cost">
                  <i className="fa-solid fa-star" style={{ fontSize: '0.7rem' }} /> {r.poin_dibutuhkan} poin
                </div>
                <button
                  className="redeem-btn"
                  disabled={!can}
                  onClick={() => { setSelected(r); setError(null); }}
                >
                  {can ? 'Tukar' : 'Poin Kurang'}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="poin-history-list stagger">
          {deposits.length === 0 && redemptions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrap">
                <i className="fa-solid fa-receipt" />
              </div>
              <h3>Belum ada riwayat</h3>
              <p>Poin yang kamu kumpulkan dan tukar akan muncul di sini.</p>
            </div>
          ) : (
            <>
              {deposits.map((d, i) => (
                <div className="poin-history-item" key={`d-${d.id}`} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="ph-icon ph-plus"><i className="fa-solid fa-plus" /></div>
                  <div className="ph-info">
                    <h5>Setor {d.jenis_limbah}</h5>
                    <p>{new Date(d.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <div className="ph-amount plus">+{d.poin}</div>
                </div>
              ))}
              {redemptions.map((r, i) => (
                <div className="poin-history-item" key={`r-${r.id}`} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="ph-icon ph-minus"><i className="fa-solid fa-minus" /></div>
                  <div className="ph-info">
                    <h5>Tukar {r.nama_reward}</h5>
                    <p>{new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <div className="ph-amount minus">-{r.poin_digunakan}</div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Modal konfirmasi */}
      {selected && (
        <div className="modal-overlay active" onClick={() => setSelected(null)}>
          <div className="modal-sheet" style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>
              <i className="fa-solid fa-xmark" />
            </button>
            <div className="sheet-handle" />
            <div style={{ textAlign: 'center' }}>
              <div className="reward-icon" style={{ margin: '0 auto 0.8rem', width: 72, height: 72 }}>
                <RewardImg nama={selected.nama} size={64} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.3rem' }}>Tukar {selected.nama}?</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>{selected.deskripsi}</p>
              <div className="cost" style={{ justifyContent: 'center', marginBottom: '1.2rem' }}>
                <i className="fa-solid fa-star" style={{ fontSize: '0.75rem' }} /> {selected.poin_dibutuhkan} poin
              </div>
              {error && <div className="modal-error">{error}</div>}
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button className="btn-submit" style={{ background: 'var(--border)', color: 'var(--text-secondary)' }} onClick={() => setSelected(null)}>
                  <span className="btn-label">Batal</span>
                </button>
                <button className={`btn-submit${submitting ? ' loading' : ''}`} onClick={handleRedeem} disabled={submitting}>
                  <span className="btn-label">{submitting ? 'Memproses...' : 'Konfirmasi'}</span>
                  <span className="spin" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal sukses */}
      {done && (
        <div className="modal-overlay active" onClick={() => setDone(null)}>
          <div className="modal-sheet" style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setDone(null)}>
              <i className="fa-solid fa-xmark" />
            </button>
            <div className="sheet-handle" />
            <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: '2rem', color: 'var(--accent)' }} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.3rem' }}>Penukaran Berhasil!</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.2rem' }}>
                {done.nama} sedang diproses. Tim ZymeGo akan menghubungi Anda.
              </p>
              <button className="btn-submit" onClick={() => setDone(null)}>
                <span className="btn-label">Selesai</span>
                <span className="spin" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
