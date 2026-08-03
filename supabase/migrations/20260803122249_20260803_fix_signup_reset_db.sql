/*
# Fix signup trigger + Reset database

## Changes
1. Recreate fn_handle_new_user with explicit SET search_path to fix "Database error saving new user" error.
2. Delete all existing user data (deposits, redemptions, profiles, auth.users) for a fresh start.
3. Re-create the admin user after the reset.
4. Re-enable email confirmation.
*/

-- 1. Fix trigger function with search_path
CREATE OR REPLACE FUNCTION public.fn_handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 2. Reset all data
DELETE FROM redemptions;
DELETE FROM deposits;
DELETE FROM profiles;
DELETE FROM auth.users;

-- 3. Re-create admin user
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
  email_change_token_new,
  recovery_token,
  is_sso_user,
  is_anonymous
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
  '',
  false,
  false
);

-- 4. Re-enable email confirmation
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'config') THEN
    UPDATE auth.config SET value = 'true' WHERE key = 'mailer_confirm_email';
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
