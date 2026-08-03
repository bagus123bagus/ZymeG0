import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

interface DepositRow {
  id: string;
  user_id: string;
  jenis_limbah: string;
  berat_kg: number;
  keterangan: string;
  opsi: string;
  lokasi_mitra: string | null;
  poin: number;
  harga: number;
  status: string;
  created_at: string;
}

interface ProfileRow {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  email?: string;
  created_at: string;
}

type Tab = 'deposits' | 'users';

export default function AdminPanel() {
  const { signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('deposits');
  const [deposits, setDeposits] = useState<DepositRow[]>([]);
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  async function loadData() {
    setLoading(true);
    if (tab === 'deposits') {
      const { data } = await supabase
        .from('deposits')
        .select('id, user_id, jenis_limbah, berat_kg, keterangan, opsi, lokasi_mitra, poin, harga, status, created_at')
        .order('created_at', { ascending: false });
      setDeposits((data as DepositRow[]) || []);
    } else {
      const { data: prof } = await supabase
        .from('profiles')
        .select('id, full_name, phone, address, created_at')
        .order('created_at', { ascending: false });
      setUsers((prof as ProfileRow[]) || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [tab]);

  async function confirmDeposit(id: string) {
    setActionLoading(id);
    await supabase.from('deposits').update({ status: 'diterima' }).eq('id', id);
    setActionLoading(null);
    loadData();
  }

  async function rejectDeposit(id: string) {
    setActionLoading(id);
    await supabase.from('deposits').update({ status: 'ditolak' }).eq('id', id);
    setActionLoading(null);
    loadData();
  }

  const filteredDeposits = deposits.filter((d) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return d.jenis_limbah.toLowerCase().includes(s) || d.keterangan?.toLowerCase().includes(s);
  });

  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return u.full_name?.toLowerCase().includes(s) || u.phone?.includes(s);
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3f0', paddingBottom: '2rem' }}>
      {/* Admin header */}
      <div style={{
        background: 'linear-gradient(135deg, #2d6a1f, #4a9a2a)',
        color: '#fff',
        padding: '1.5rem 1.3rem 1.2rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <i className="fa-solid fa-shield-halved" style={{ fontSize: '1.3rem' }} />
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Admin Panel</h1>
            </div>
            <p style={{ fontSize: '0.82rem', opacity: 0.85, margin: 0 }}>ZymeGo Ecoenzyme Center</p>
          </div>
          <button
            onClick={signOut}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#fff',
              padding: '0.6rem 1rem',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            <i className="fa-solid fa-right-from-bracket" style={{ marginRight: '0.4rem' }} />
            Keluar
          </button>
        </div>
      </div>

      {/* Stats summary */}
      <div style={{ display: 'flex', gap: '0.8rem', padding: '1.2rem 1.3rem 0' }}>
        <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '0.72rem', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Menunggu</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706' }}>{deposits.filter((d) => d.status === 'pending').length}</div>
        </div>
        <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '0.72rem', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Diterima</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a' }}>{deposits.filter((d) => d.status === 'diterima').length}</div>
        </div>
        <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '0.72rem', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Total User</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4a9a2a' }}>{users.length || '—'}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', padding: '1.2rem 1.3rem 0' }}>
        <button
          onClick={() => setTab('deposits')}
          style={{
            flex: 1,
            padding: '0.7rem',
            borderRadius: 10,
            border: 'none',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            background: tab === 'deposits' ? '#2d6a1f' : '#fff',
            color: tab === 'deposits' ? '#fff' : '#666',
          }}
        >
          <i className="fa-solid fa-recycle" style={{ marginRight: '0.4rem' }} />
          Konfirmasi Setor
        </button>
        <button
          onClick={() => setTab('users')}
          style={{
            flex: 1,
            padding: '0.7rem',
            borderRadius: 10,
            border: 'none',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            background: tab === 'users' ? '#2d6a1f' : '#fff',
            color: tab === 'users' ? '#fff' : '#666',
          }}
        >
          <i className="fa-solid fa-users" style={{ marginRight: '0.4rem' }} />
          Data User
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '0.8rem 1.3rem 0' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#fff',
          borderRadius: 10,
          padding: '0.6rem 0.8rem',
        }}>
          <i className="fa-solid fa-magnifying-glass" style={{ color: '#aaa' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tab === 'deposits' ? 'Cari berdasarkan jenis limbah...' : 'Cari nama atau nomor HP...'}
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.85rem', background: 'transparent' }}
          />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0.8rem 1.3rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.5rem' }} />
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Memuat data...</p>
          </div>
        ) : tab === 'deposits' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {filteredDeposits.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#999', fontSize: '0.85rem' }}>
                Tidak ada data setoran.
              </div>
            )}
            {filteredDeposits.map((d) => (
              <div key={d.id} style={{
                background: '#fff',
                borderRadius: 14,
                padding: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 6,
                        background: d.jenis_limbah === 'Buah' ? '#fef3c7' : '#dcfce7',
                        color: d.jenis_limbah === 'Buah' ? '#92400e' : '#166534',
                      }}>
                        {d.jenis_limbah}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#999' }}>
                        {new Date(d.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#333' }}>
                      {d.berat_kg} kg {d.keterangan ? `— ${d.keterangan}` : ''}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem' }}>
                      <i className="fa-solid fa-route" style={{ marginRight: '0.3rem' }} />
                      {d.opsi}{d.lokasi_mitra ? ` — ${d.lokasi_mitra}` : ''}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4a9a2a' }}>{d.poin}</div>
                    <div style={{ fontSize: '0.68rem', color: '#999' }}>poin</div>
                  </div>
                </div>

                {/* Status badge */}
                <div style={{ marginBottom: '0.6rem' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: 6,
                    background: d.status === 'diterima' ? '#d1fae5' : d.status === 'ditolak' ? '#fee2e2' : '#fef3c7',
                    color: d.status === 'diterima' ? '#166534' : d.status === 'ditolak' ? '#991b1b' : '#92400e',
                  }}>
                    {d.status === 'diterima' ? 'Diterima' : d.status === 'ditolak' ? 'Ditolak' : 'Menunggu Konfirmasi'}
                  </span>
                </div>

                {/* Actions */}
                {d.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => confirmDeposit(d.id)}
                      disabled={actionLoading === d.id}
                      style={{
                        flex: 1,
                        padding: '0.55rem',
                        borderRadius: 8,
                        border: 'none',
                        background: '#16a34a',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: actionLoading === d.id ? 'wait' : 'pointer',
                        opacity: actionLoading === d.id ? 0.6 : 1,
                      }}
                    >
                      {actionLoading === d.id ? <i className="fa-solid fa-spinner fa-spin" /> : <><i className="fa-solid fa-check" style={{ marginRight: '0.3rem' }} />Konfirmasi</>}
                    </button>
                    <button
                      onClick={() => rejectDeposit(d.id)}
                      disabled={actionLoading === d.id}
                      style={{
                        flex: 1,
                        padding: '0.55rem',
                        borderRadius: 8,
                        border: 'none',
                        background: '#ef4444',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: actionLoading === d.id ? 'wait' : 'pointer',
                        opacity: actionLoading === d.id ? 0.6 : 1,
                      }}
                    >
                      {actionLoading === d.id ? <i className="fa-solid fa-spinner fa-spin" /> : <><i className="fa-solid fa-xmark" style={{ marginRight: '0.3rem' }} />Tolak</>}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {filteredUsers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#999', fontSize: '0.85rem' }}>
                Tidak ada data user.
              </div>
            )}
            {filteredUsers.map((u) => (
              <div key={u.id} style={{
                background: '#fff',
                borderRadius: 14,
                padding: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: '#eaf5d6',
                  color: '#4a9a2a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  flexShrink: 0,
                }}>
                  {(u.full_name || 'U').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#333' }}>{u.full_name || 'Tanpa Nama'}</div>
                  <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '0.1rem' }}>
                    {u.phone && <><i className="fa-solid fa-phone" style={{ marginRight: '0.3rem' }} />{u.phone}</>}
                  </div>
                  {u.address && (
                    <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.1rem' }}>
                      <i className="fa-solid fa-location-dot" style={{ marginRight: '0.3rem' }} />{u.address}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#bbb' }}>
                  {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
