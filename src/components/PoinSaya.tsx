import { useEffect, useState } from 'react';
import { supabase, type Reward, type Redemption } from '../lib/supabase';
import { useAuth } from '../lib/auth';

interface Props {
  totalPoin: number;
  deposits: any[];
  redemptions: any[];
  onRedeemed: (r: Redemption) => void;
}

const rewardIcons: Record<string, string> = {
  'Sabun Cuci Piring': 'fa-hand-sparkles',
  'Pupuk Organik': 'fa-seedling',
  'Cairan Pel Lantai': 'fa-bucket',
  'Tumbler ZymeGo': 'fa-bottle-water',
  'Voucher Belanja Rp5.000': 'fa-ticket',
  'Voucher Produk ZymeGo': 'fa-gift',
};

export default function PoinSaya({ totalPoin, deposits, redemptions, onRedeemed }: Props) {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [tab, setTab] = useState<'reward' | 'riwayat'>('reward');

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('rewards')
        .select('id, nama, deskripsi, poin_dibutuhkan, ikon, kategori')
        .order('poin_dibutuhkan', { ascending: true });
      setRewards((data as Reward[]) || []);
    })();
  }, []);

  async function handleRedeem(r: Reward) {
    if (!user) return;
    if (totalPoin < r.poin_dibutuhkan) return;
    const { data, error } = await supabase
      .from('redemptions')
      .insert({
        user_id: user.id,
        reward_id: r.id,
        nama_reward: r.nama,
        poin_digunakan: r.poin_dibutuhkan,
      })
      .select('id, user_id, reward_id, nama_reward, poin_digunakan, status, created_at')
      .maybeSingle();
    if (error || !data) return;
    onRedeemed(data as Redemption);
  }

  const totalKg = deposits.reduce((s, d) => s + Number(d.berat_kg), 0);

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
        <span className="label">💰 Konversi Harga</span>
        <span className="value">{totalKg.toFixed(1).replace('.', ',')} kg = Rp{(totalKg * 500).toLocaleString('id-ID')}</span>
      </div>

      <div className="tab-switch">
        <button
          className={tab === 'reward' ? 'active' : ''}
          onClick={() => setTab('reward')}
        >
          Tukar Poin
        </button>
        <button
          className={tab === 'riwayat' ? 'active' : ''}
          onClick={() => setTab('riwayat')}
        >
          Riwayat Poin
        </button>
      </div>

      {tab === 'reward' ? (
        <div className="reward-grid stagger">
          {rewards.map((r, i) => (
            <div className="reward-card" key={r.id} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="reward-icon">
                <i className={`fa-solid ${rewardIcons[r.nama] || 'fa-gift'}`} />
              </div>
              <h4>{r.nama}</h4>
              <div className="cost">
                <i className="fa-solid fa-star" style={{ fontSize: '0.7rem' }} /> {r.poin_dibutuhkan} poin
              </div>
              <button
                className="redeem-btn"
                disabled={totalPoin < r.poin_dibutuhkan}
                onClick={() => handleRedeem(r)}
              >
                Tukar
              </button>
            </div>
          ))}
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
                  <div className="ph-icon ph-plus">
                    <i className="fa-solid fa-plus" />
                  </div>
                  <div className="ph-info">
                    <h5>Setor {d.jenis_limbah}</h5>
                    <p>{new Date(d.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <div className="ph-amount plus">+{d.poin}</div>
                </div>
              ))}
              {redemptions.map((r, i) => (
                <div className="poin-history-item" key={`r-${r.id}`} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="ph-icon ph-minus">
                    <i className="fa-solid fa-minus" />
                  </div>
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
    </section>
  );
}
