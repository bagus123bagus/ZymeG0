/*
# Admin Panel, Deposit Confirmation Flow & Email OTP

## Overview
This migration adds:
1. Admin role recognition (by email) with RLS policies to manage all deposits and view all users.
2. Deposit confirmation flow: user deposits are now "pending" until admin confirms.
3. Email OTP: new signups must verify their email before logging in.
4. Auto-create profile trigger: profiles are created server-side on signup (needed for OTP flow).

## Changes

### 1. deposits table
- Default status changed from 'diterima' to 'pending'.
- Trigger updated to set status = 'pending' on INSERT only (not UPDATE, so admin can confirm).

### 2. RLS policies (admin access)
- deposits SELECT: users see own + admin sees all.
- deposits UPDATE: users update own + admin updates all (for confirmation).
- profiles SELECT: users see own + admin sees all.

### 3. Profile auto-creation trigger
- SECURITY DEFINER function on auth.users AFTER INSERT.
- Reads full_name and phone from raw_user_meta_data.
- Eliminates the need for client-side profile insert (which fails under email confirmation since there's no session).

### 4. Admin user
- Creates the admin user (zymegoadm1n@gmail.com) with confirmed email.

### 5. Email confirmation
- Attempts to enable mailer_confirm_email in auth.config.
*/

-- 1. Change default status to pending
ALTER TABLE deposits ALTER COLUMN status SET DEFAULT 'pending';

-- 2. Update trigger: set status = 'pending' on INSERT only
CREATE OR REPLACE FUNCTION fn_calc_deposit_points()
RETURNS trigger AS $$
BEGIN
  NEW.poin := GREATEST(1, ROUND(NEW.berat_kg));
  NEW.harga := GREATEST(0, (NEW.berat_kg * 500)::integer);
  IF NEW.opsi = 'Antar' THEN
    NEW.lokasi_mitra := NULL;
  END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Admin RLS policies
-- deposits: admin can read all + update all (confirm)
DROP POLICY IF EXISTS "select_own_deposits" ON deposits;
CREATE POLICY "select_own_deposits" ON deposits FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR auth.jwt() ->> 'email' = 'zymegoadm1n@gmail.com'
  );

DROP POLICY IF EXISTS "update_own_deposits" ON deposits;
CREATE POLICY "update_own_deposits" ON deposits FOR UPDATE
  TO authenticated USING (
    auth.uid() = user_id
    OR auth.jwt() ->> 'email' = 'zymegoadm1n@gmail.com'
  ) WITH CHECK (
    auth.uid() = user_id
    OR auth.jwt() ->> 'email' = 'zymegoadm1n@gmail.com'
  );

-- profiles: admin can read all
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (
    auth.uid() = id
    OR auth.jwt() ->> 'email' = 'zymegoadm1n@gmail.com'
  );

-- 4. Profile auto-creation trigger (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION fn_handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_handle_new_user ON auth.users;
CREATE TRIGGER trg_handle_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION fn_handle_new_user();

-- 5. Create admin user (if not exists)
DO $$
DECLARE
  admin_uuid uuid;
BEGIN
  SELECT id INTO admin_uuid FROM auth.users WHERE email = 'zymegoadm1n@gmail.com';
  IF admin_uuid IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  confirmation_token,
  email_change,
  email_change_token_newemail,
  recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'zymegoadm1n@gmail.com',
      crypt('zymegoB4GUS', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Admin"}',
      '',
      '',
      '',
      ''
    );
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- 6. Enable email confirmation
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'config') THEN
    UPDATE auth.config SET value = 'true' WHERE key = 'mailer_confirm_email';
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
