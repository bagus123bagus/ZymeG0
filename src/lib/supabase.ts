import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type JenisLimbah = 'Buah' | 'Sayuran';
export type OpsiSetor = 'Antar' | 'Jemput';

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  created_at: string;
}

export interface Deposit {
  id: string;
  user_id: string;
  jenis_limbah: JenisLimbah;
  berat_kg: number;
  keterangan: string;
  opsi: OpsiSetor;
  lokasi_mitra: string | null;
  poin: number;
  harga: number;
  status: string;
  created_at: string;
}

export interface Reward {
  id: string;
  nama: string;
  deskripsi: string;
  poin_dibutuhkan: number;
  ikon: string;
  kategori: string;
}

export interface Redemption {
  id: string;
  user_id: string;
  reward_id: string | null;
  nama_reward: string;
  poin_digunakan: number;
  status: string;
  created_at: string;
}
