import { useEffect, useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import AuthScreen from './components/AuthScreen';
import Navbar, { type Page } from './components/Navbar';
import Beranda from './components/Beranda';
import SetorLimbah from './components/SetorLimbah';
import PoinSaya from './components/PoinSaya';
import Riwayat from './components/Riwayat';
import Profil from './components/Profil';
import Edukasi from './components/Edukasi';
import Monitoring from './components/Monitoring';
import NotifPanel, { type Notif } from './components/NotifPanel';
import Toasts, { useToasts } from './components/Toasts';
import { Leaf } from 'lucide-react';
import { supabase } from './lib/supabase';

function Shell() {
  const { user, profile, loading } = useAuth();
  const [page, setPage] = useState<Page>('beranda');
  const [totalPoin, setTotalPoin] = useState(0);
  const [totalKg, setTotalKg] = useState(0);
  const [totalSetor, setTotalSetor] = useState(0);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast, ToastContainer } = useToasts();

  const loadData = useCallback(async () => {
    if (!user) return;
    const [{ data: dep }, { data: red }] = await Promise.all([
      supabase
        .from('deposits')
        .select('id, user_id, jenis_limbah, berat_kg, keterangan, opsi, lokasi_mitra, poin, harga, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('redemptions')
        .select('id, user_id, reward_id, nama_reward, poin_digunakan, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
    ]);
    const depRows = dep || [];
    const redRows = red || [];
    setDeposits(depRows);
    setRedemptions(redRows);
    const earned = depRows.reduce((s: number, d: any) => s + (d.poin || 0), 0);
    const used = redRows.reduce((s: number, r: any) => s + (r.poin_digunakan || 0), 0);
    setTotalPoin(Math.max(0, earned - used));
    setTotalKg(depRows.reduce((s: number, d: any) => s + Number(d.berat_kg), 0));
    setTotalSetor(depRows.length);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setTotalPoin(0);
      setTotalKg(0);
      setTotalSetor(0);
      setDeposits([]);
      setRedemptions([]);
      return;
    }
    loadData();
  }, [user, refreshKey, loadData]);

  function addNotif(n: Notif) {
    setNotifs((prev) => [n, ...prev].slice(0, 20));
  }

  function handleDepositSaved(d: any) {
    setRefreshKey((k) => k + 1);
    addNotif({
      icon: 'fa-star',
      text: `Kamu mendapatkan ${d.poin} poin dari setor limbah!`,
      time: 'Baru saja',
    });
  }

  function handleRedeemed(r: any) {
    setRefreshKey((k) => k + 1);
    addNotif({
      icon: 'fa-gift',
      text: `Reward "${r.nama_reward}" berhasil ditukar.`,
      time: 'Baru saja',
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'linear-gradient(145deg, #4a9a2a, #2d6a1f)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              animation: 'pop 1s ease infinite',
            }}
          >
            <Leaf style={{ width: 32, height: 32, color: '#fff' }} />
          </div>
          <p style={{ marginTop: 12, color: 'var(--accent-dark)', fontWeight: 800 }}>ZymeGo</p>
        </div>
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  return (
    <div className="phone">
      <Navbar
        page={page}
        setPage={setPage}
        notifCount={notifs.length}
        onBellClick={() => {}}
      />

      <main id="app">
        {page === 'beranda' && (
          <Beranda
            setPage={setPage}
            totalPoin={totalPoin}
            totalKg={totalKg}
            userName={profile?.full_name || 'Pengguna'}
            userEmail={user.email || ''}
          />
        )}
        {page === 'setor' && (
          <SetorLimbah
            onSaved={(d) => {
              handleDepositSaved(d);
              toast('Setor berhasil! Poin bertambah 🌱', 'fa-circle-check');
            }}
          />
        )}
        {page === 'poin' && (
          <PoinSaya
            totalPoin={totalPoin}
            deposits={deposits}
            redemptions={redemptions}
            onRedeemed={(r) => {
              handleRedeemed(r);
              toast(`Berhasil menukar ${r.nama_reward}!`, 'fa-gift');
            }}
          />
        )}
        {page === 'riwayat' && <Riwayat deposits={deposits} setPage={setPage} />}
        {page === 'profil' && (
          <Profil
            totalPoin={totalPoin}
            totalKg={totalKg}
            totalSetor={totalSetor}
            onSignOut={() => toast('Kamu berhasil keluar. Sampai jumpa!', 'fa-right-from-bracket')}
            onToast={toast}
          />
        )}
        {page === 'edukasi' && <Edukasi />}
        {page === 'monitoring' && (
          <Monitoring deposits={deposits} totalKg={totalKg} totalSetor={totalSetor} />
        )}
      </main>

      <NotifPanel notifs={notifs} />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
