# API Key Verification Guide

## 🔑 Verify Clerk Keys

### Step 1: Login to Clerk Dashboard
1. Go to: https://dashboard.clerk.com
2. Sign in with your Clerk account
3. Select your application: **sound-wildcat-23** (or your app name)

### Step 2: Find Your Publishable Key
1. In the left sidebar, click **Configure** → **API Keys**
   - Or: **Developers** → **API Keys** (depending on UI version)
2. Look for **Publishable key** section
3. You should see a key that starts with `pk_test_` or `pk_live_`
4. Click the **Copy** button next to it

### Step 3: Compare with Your .env.local
Your current key in `.env.local`:
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_c291bmQtd2lsZGNhdC0yMy5jbGVyay5hY2NvdW50cy5kZXYk
```

**Expected format:**
- Starts with `pk_test_` (development) or `pk_live_` (production)
- Contains base64-encoded domain info
- May end with special characters like `$`

### Step 4: Test Clerk Connection
Run this in your browser console (http://localhost:3001):
```javascript
// Check if Clerk is loaded
console.log('Clerk loaded:', window.Clerk);

// Check publishable key
console.log('Clerk key:', import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
```

**Expected output:**
- `Clerk loaded: Object { ... }` (Clerk instance)
- `Clerk key: pk_test_c291bmQtd2lsZGNhdC0yMy5jbGVyay5hY2NvdW50cy5kZXYk`

### Step 5: Verify Clerk Features Enabled
In Clerk Dashboard → **User & Authentication**:

#### Email/Password:
- [ ] **Email** - Toggle ON
- [ ] **Password** - Toggle ON

#### Social Connections:
- [ ] **Google** - Toggle ON (if you want Google OAuth)

#### Email Settings:
1. Go to **Email, Phone, Username** → **Email addresses**
2. Ensure **Verification** is enabled
3. Check **Email templates** are configured

---

## 🗄️ Verify Supabase Keys

### Step 1: Login to Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Sign in with your Supabase account
3. Select your project: **wazrqqxpqbqpsbgyvcbg** (from your URL)

### Step 2: Find Your API Keys
1. In the left sidebar, click **Settings** (gear icon at bottom)
2. Click **API** in the settings menu
3. You'll see two keys:
   - **Project URL**: Your Supabase URL
   - **anon public**: Your anonymous/public key

### Step 3: Compare with Your .env.local
Your current keys in `.env.local`:
```
VITE_SUPABASE_URL=https://wazrqqxpqbqpsbgyvcbg.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_UskzL7fnOFNA0-PQDi9sDA_BR8XOogJ
```

**⚠️ POTENTIAL ISSUE DETECTED:**
Your Supabase anon key starts with `sb_publishable_` which is unusual. 

**Expected format:**
- Should start with `eyJ...` (JWT token format)
- Should be a long string (300+ characters)
- Should NOT start with `sb_publishable_`

### Step 4: Get the Correct Supabase Keys
In Supabase Dashboard → Settings → API:

1. **Project URL**: Copy exactly as shown
   - Format: `https://[project-ref].supabase.co`
   
2. **anon public key**: Copy the full key
   - Should start with: `eyJhbGc...`
   - Very long (300-500 characters)
   - This is a JWT token

**Replace in .env.local:**
```env
VITE_SUPABASE_URL=https://[your-project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (full token)
```

### Step 5: Test Supabase Connection
Run this in your browser console:
```javascript
// Test Supabase connection
import { supabase } from './src/lib/supabaseClient';

// Test query (should return empty or data, NOT error)
supabase.from('profiles').select('*').limit(1)
  .then(({ data, error }) => {
    console.log('Supabase test:', { data, error });
  });
```

**Expected output:**
- `{ data: [], error: null }` (if table is empty)
- `{ data: [...], error: null }` (if data exists)
- **NOT:** `{ data: null, error: {...} }` (indicates connection problem)

### Step 6: Verify Supabase Database Setup
Check if the `profiles` table exists:

1. In Supabase Dashboard → **Table Editor**
2. Look for `profiles` table
3. If missing, run this SQL in **SQL Editor**:

```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  personal_code TEXT UNIQUE NOT NULL,
  signup_zone TEXT NOT NULL,
  zone_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert"
  ON public.profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select"
  ON public.profiles FOR SELECT USING (true);
```

---

## 🧪 Test Authentication Flow

### Test 1: Clerk Sign Up
1. Go to http://localhost:3001
2. Click **Sign Up** on front door
3. Enter email and password
4. Check your email for verification code
5. Enter the 6-digit code
6. **Expected:** Account created, personal code displayed

**If it fails:**
- Check browser console for errors
- Verify Clerk key is correct
- Check Clerk Dashboard → Logs for details

### Test 2: Supabase Personal Code Storage
After signing up, check if personal code was saved:

In Supabase Dashboard → Table Editor → `profiles`:
- Look for a new row with your user ID
- Check if `personal_code` column has a 4-digit code
- Verify `email` and `signup_zone` are populated

**If no row:**
- Check browser console errors
- Verify Supabase anon key is correct
- Check RLS policies allow INSERT

### Test 3: Sign In
1. Go to front door (refresh if needed)
2. Click **Sign In**
3. Enter your credentials
4. **Expected:** Signed in, access granted to house

### Test 4: Forgot Password
1. Click **Sign In**
2. Enter your email
3. Click **Forgot password?**
4. Check email for reset code
5. Enter code to reset password
6. **Expected:** Password reset successful

---

## 🔧 Common Issues & Solutions

### Issue 1: "url.startsWith is not a function"
**Cause:** Invalid URL passed to Clerk
**Solution:** Already fixed - using `window.location.origin` for redirects

### Issue 2: Supabase connection fails
**Symptoms:**
- Personal codes not saving
- `401 Unauthorized` errors
- `Invalid API key` errors

**Solutions:**
1. Verify anon key format (should start with `eyJ...`)
2. Copy the FULL key (300+ characters)
3. Restart dev server after changing `.env.local`
4. Check RLS policies in Supabase

### Issue 3: Email verification not working
**Cause:** Email provider in Clerk or email settings
**Solutions:**
1. Check Clerk Dashboard → User & Authentication → Email addresses
2. Verify email verification is enabled
3. Check spam folder
4. Try different email address

### Issue 4: Sign up completes but no personal code
**Symptoms:** User created in Clerk but not in Supabase
**Solutions:**
1. Check browser console for Supabase errors
2. Verify `profiles` table exists
3. Check RLS policies allow INSERT
4. Verify Supabase anon key is correct

---

## 📝 Checklist: What Should Work

After verifying keys, you should be able to:

- [ ] See front door with Sign In/Sign Up buttons
- [ ] Sign up with email/password
- [ ] Receive verification email from Clerk
- [ ] Enter verification code
- [ ] See personal 4-digit code displayed
- [ ] Personal code saved in Supabase `profiles` table
- [ ] Sign in with email/password
- [ ] Click "Forgot password?" link
- [ ] Receive password reset email
- [ ] Reset password with code
- [ ] Access granted to enter house
- [ ] Doorbell plays when clicking Enter

---

## 🆘 Quick Verification Commands

Run these in your terminal to verify everything is configured:

```bash
# Check if keys are in .env.local
cat .env.local | grep CLERK
cat .env.local | grep SUPABASE

# Restart dev server (required after .env changes)
npm run dev

# Check if packages are installed
npm list @clerk/clerk-react @supabase/supabase-js
```

---

## 📋 Key Format Reference

### Valid Clerk Publishable Key:
```
pk_test_c291bmQtd2lsZGNhdC0yMy5jbGVyay5hY2NvdW50cy5kZXYk ✅
```

### Invalid Supabase Anon Key (Current):
```
sb_publishable_UskzL7fnOFNA0-PQDi9sDA_BR8XOogJ ❌
```

### Valid Supabase Anon Key (Example):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbXJxcXhwcWJxcHNiZ3l2Y2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDg1MTY2OTUsImV4cCI6MTk2NDA5MjY5NX0.1234567890abcdefghijklmnopqrstuvwxyz ✅
```

---

## 🎯 Next Steps

1. **Verify Supabase Anon Key** - This is likely the main issue
2. **Copy correct key from Supabase Dashboard**
3. **Update .env.local with full JWT token**
4. **Restart dev server**: `npm run dev`
5. **Test sign up flow**
6. **Check if personal code saves to Supabase**

**Your Supabase key format is incorrect. Please get the real anon key from your dashboard!**
