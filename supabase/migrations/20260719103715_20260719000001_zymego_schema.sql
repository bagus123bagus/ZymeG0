/*
# ZymeGo - Ecoenzyme Waste Deposit & Rewards Platform

## Overview
Membuat schema lengkap untuk aplikasi ZymeGo: platform setor limbah buah/sayuran,
perolehan poin, dan tukar reward. Aplikasi multi-user dengan login Supabase.

## Tables

### 1. profiles
- Memperluas auth.users dengan nama lengkap & alamat.
- `id` (uuid, PK, references auth.users)
- `full_name` (text)
- `phone` (text)
- `address` (text)
- `created_at` (timestamptz)

### 2. deposits (setoran limbah)
- `id` (uuid PK)
- `user_id` (uuid, owner, default auth.uid())
- `jenis_limbah` (text: 'Buah' | 'Sayuran')
- `berat_kg` (numeric, berat aktual bisa desimal)
- `keterangan` (text, isi jenis limbah spesifik)
- `opsi` (text: 'Antar' | 'Jemput')
- `lokasi_mitra` (text, nullable, hanya untuk opsi Jemput)
- `poin` (integer, 1 kg = 1 poin)
- `harga` (integer, 1 kg = Rp500)
- `status` (text: 'pending' | 'diterima' | 'selesai')
- `created_at` (timestamptz)

### 3. rewards (katalog reward)
- `id` (uuid PK)
- `nama` (text)
- `deskripsi` (text)
- `poin_dibutuhkan` (integer)
- `ikon` (text, nama ikon lucide)
- `stok` (integer, default 0 = unlimited)

### 4. redemptions (penukaran poin)
- `id` (uuid PK)
- `user_id` (uuid, owner, default auth.uid())
- `reward_id` (uuid FK)
- `nama_reward` (text, snapshot)
- `poin_digunakan` (integer)
- `status` (text: 'diproses' | 'selesai')
- `created_at` (timestamptz)

## Security (RLS)
- Semua table enable RLS.
- profiles, deposits, redemptions: owner-scoped (auth.uid() = user_id).
- rewards: bisa dibaca semua authenticated (katalog publik), insert/update/delete hanya admin (tidak ada policy = blocked untuk anon/authenticated, aman).
- Default user_id = auth.uid() agar insert tanpa user_id tetap valid.

## Notes
1. Aplikasi punya login, jadi policy scoped TO authenticated.
2. Poin & harga dihitung di backend (trigger) supaya konsisten.
3. Seed data rewards dimasukkan via execute_sql terpisah.
*/

-- profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  address text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- deposits
CREATE TABLE IF NOT EXISTS deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  jenis_limbah text NOT NULL CHECK (jenis_limbah IN ('Buah','Sayuran')),
  berat_kg numeric(10,3) NOT NULL CHECK (berat_kg > 0),
  keterangan text DEFAULT '',
  opsi text NOT NULL CHECK (opsi IN ('Antar','Jemput')),
  lokasi_mitra text,
  poin integer NOT NULL DEFAULT 0,
  harga integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'diterima',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_deposits" ON deposits;
CREATE POLICY "select_own_deposits" ON deposits FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_deposits" ON deposits;
CREATE POLICY "insert_own_deposits" ON deposits FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_deposits" ON deposits;
CREATE POLICY "update_own_deposits" ON deposits FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_deposits" ON deposits;
CREATE POLICY "delete_own_deposits" ON deposits FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- rewards
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  deskripsi text DEFAULT '',
  poin_dibutuhkan integer NOT NULL CHECK (poin_dibutuhkan > 0),
  ikon text DEFAULT 'Gift',
  kategori text DEFAULT 'umum',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_rewards" ON rewards;
CREATE POLICY "read_rewards" ON rewards FOR SELECT
  TO authenticated USING (true);

-- redemptions
CREATE TABLE IF NOT EXISTS redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id uuid REFERENCES rewards(id) ON DELETE SET NULL,
  nama_reward text NOT NULL,
  poin_digunakan integer NOT NULL CHECK (poin_digunakan > 0),
  status text NOT NULL DEFAULT 'diproses',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_redemptions" ON redemptions;
CREATE POLICY "select_own_redemptions" ON redemptions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_redemptions" ON redemptions;
CREATE POLICY "insert_own_redemptions" ON redemptions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Trigger: hitung poin & harga otomatis saat insert deposit
CREATE OR REPLACE FUNCTION fn_calc_deposit_points()
RETURNS trigger AS $$
BEGIN
  NEW.poin := GREATEST(1, ROUND(NEW.berat_kg));
  NEW.harga := GREATEST(0, (NEW.berat_kg * 500)::integer);
  -- jika opsi Antar, lokasi_mitra harus null
  IF NEW.opsi = 'Antar' THEN
    NEW.lokasi_mitra := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calc_deposit_points ON deposits;
CREATE TRIGGER trg_calc_deposit_points
BEFORE INSERT OR UPDATE ON deposits
FOR EACH ROW EXECUTE FUNCTION fn_calc_deposit_points();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_user_id ON redemptions(user_id);
