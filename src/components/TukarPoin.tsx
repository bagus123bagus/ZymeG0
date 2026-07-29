import { useEffect, useState } from 'react';
import { Gift, Ticket, SprayCan, Leaf, CupSoda, Check, Loader2, X, Coins } from 'lucide-react';
import { supabase, type Reward, type Redemption } from '../lib/supabase';
import { useAuth } from '../lib/auth';

interface Props {
  totalPoin: number;
  onRedeemed: (r: Redemption) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Ticket: <Ticket className="w-6 h-6" />,
  SprayCan: <SprayCan className="w-6 h-6" />,
  Leaf: <Leaf className="w-6 h-6" />,
  CupSoda: <CupSoda className="w-6 h-6" />,
  Gift: <Gift className="w-6 h-6" />,
};

export default function TukarPoin({ totalPoin, onRedeemed }: Props) {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Reward | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Reward | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('rewards')
        .select('id, nama, deskripsi, poin_dibutuhkan, ikon, kategori')
        .order('poin_dibutuhkan', { ascending: true });
      setRewards((data as Reward[]) || []);
      setLoading(false);
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

  return (
    <div className="px-4 py-5">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-stone-900">Tukar Poin</h1>
        <p className="text-stone-500 text-sm mt-0.5">Tukarkan poin dengan produk ZymeGo.</p>
      </div>

      {/* Poin badge */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 mb-4 flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-400/30">
          <Coins className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-amber-700 font-medium">Poin tersedia</p>
          <p className="text-xl font-extrabold text-amber-800">{totalPoin} poin</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-stone-400 text-sm">Memuat reward...</div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {rewards.map((r) => {
            const can = totalPoin >= r.poin_dibutuhkan;
            return (
              <div
                key={r.id}
                className={`rounded-2xl bg-white border p-4 flex flex-col transition-all ${
                  can ? 'border-stone-200 hover:shadow-md hover:border-[#4a9a2a]/40' : 'border-stone-200 opacity-70'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4a9a2a] to-[#2d6a1f] text-white flex items-center justify-center mb-2.5">
                  {iconMap[r.ikon] || iconMap.Gift}
                </div>
                <h3 className="font-semibold text-stone-800 text-sm leading-tight">{r.nama}</h3>
                <p className="text-[11px] text-stone-500 mt-1 flex-1">{r.deskripsi}</p>
                <div className="mt-3">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
                    {r.poin_dibutuhkan} poin
                  </span>
                </div>
                <button
                  disabled={!can}
                  onClick={() => { setSelected(r); setError(null); }}
                  className={`mt-2.5 w-full py-2.5 rounded-lg text-xs font-bold transition ${
                    can ? 'bg-[#3a7a1a] text-white hover:bg-[#2d6a14]' : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  {can ? 'Tukar Poin' : 'Poin Kurang'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal konfirmasi */}
      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4a9a2a] to-[#2d6a1f] text-white flex items-center justify-center mx-auto mb-3">
              {iconMap[selected.ikon] || iconMap.Gift}
            </div>
            <h3 className="text-lg font-bold text-stone-900">Tukar {selected.nama}?</h3>
            <p className="text-stone-500 text-sm mt-1">{selected.deskripsi}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 font-semibold text-sm">
              <Coins className="w-4 h-4" /> {selected.poin_dibutuhkan} poin
            </div>
            {error && (
              <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>
            )}
            <div className="flex gap-2 mt-5">
              <button onClick={() => setSelected(null)} className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-700 font-semibold text-sm hover:bg-stone-50">
                Batal
              </button>
              <button
                onClick={handleRedeem}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-[#3a7a1a] text-white font-bold text-sm hover:bg-[#2d6a14] disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {submitting ? 'Memproses...' : 'Konfirmasi'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal sukses */}
      {done && (
        <Modal onClose={() => setDone(null)}>
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
              <Check className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Penukaran berhasil!</h3>
            <p className="text-stone-500 text-sm mt-1">{done.nama} sedang diproses. Tim ZymeGo akan menghubungi Anda.</p>
            <button onClick={() => setDone(null)} className="mt-5 w-full py-3 rounded-xl bg-[#3a7a1a] text-white font-bold text-sm hover:bg-[#2d6a14]">
              Selesai
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg text-stone-400 hover:bg-stone-100">
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
