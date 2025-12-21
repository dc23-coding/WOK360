# Vercel Environment Variables Setup

## Critical: Your app is using development Clerk keys in production!

This is causing sign-in issues and the blank screen in Kazmo Mansion.

## Required Vercel Environment Variables

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables for **Production**, **Preview**, and **Development**:

### 1. Clerk Authentication (Get production keys!)
```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_PRODUCTION_KEY_HERE
```

**How to get production Clerk key:**
1. Go to https://dashboard.clerk.com
2. Select your project
3. Click "API Keys" in sidebar
4. Copy the **Publishable Key** from the **Production** section (starts with `pk_live_`)
5. Replace the `pk_test_` key in Vercel

### 2. Admin Access
```
VITE_ADMIN_ACCESS_CODE=3104
```

### 3. Supabase
```
VITE_SUPABASE_URL=https://wazrqqxpqbqpsbgyvcbg.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_UskzL7fnOFNA0-PQDi9sDA_BR8XOogJ
```

### 4. Sanity CMS
```
VITE_SANITY_PROJECT_ID=lp1si6d4
VITE_SANITY_DATASET=production
VITE_USE_SANITY=true
VITE_SANITY_AUTH_TOKEN=<GET_FROM_SANITY_DASHBOARD>
```

**⚠️ SECURITY NOTE:** Never commit actual tokens to Git. Get your token from:
https://www.sanity.io/manage/personal/project/lp1si6d4/api/tokens

## After Adding Variables

1. **Redeploy** - Vercel will automatically redeploy with new variables
2. **Wait 2-3 minutes** for build to complete
3. **Test sign-in** - Should work with production Clerk keys

## Why This Fixes the Blank Screen

- Kazmo Mansion requires authentication: `canEnter = !!user || adminUnlocked`
- Development Clerk keys have strict limits and may not work in production
- Without proper auth, `user` is null → `canEnter` is false → blank screen at front door
- Production keys remove limits and enable proper authentication flow

## Clerk Production Setup

If you don't have a production Clerk instance yet:

1. Go to https://dashboard.clerk.com
2. Click your project name dropdown
3. Select "Create production instance"
4. Follow the wizard
5. Copy the new production keys to Vercel

## Current Status

✅ **Fixed in code:**
- Replaced deprecated `afterSignInUrl` with `fallbackRedirectUrl`
- Fixed Sanity image-url deprecation warning
- Clerk auth context working correctly

❌ **Not fixed (requires manual action):**
- Production Clerk keys needed in Vercel environment variables
- CORS origin may need Vercel production domain added to Sanity

## Testing Checklist

After deploying with production keys:

- [ ] Sign in works on production
- [ ] Kazmo Mansion front door displays (not blank)
- [ ] Light Hallway loads after entering
- [ ] Dark Wing accessible with premium/admin unlock
- [ ] No Clerk "development keys" warning in console
