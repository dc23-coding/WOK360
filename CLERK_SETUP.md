# Clerk Integration Setup Guide

## ✅ Migration Complete!

Your app now uses **Clerk** for authentication with **Google OAuth** enabled, while keeping Supabase for database operations.

## What Changed

### Files Updated:
- ✅ `src/main.jsx` - Wrapped with ClerkProvider
- ✅ `src/context/ClerkAuthContext.jsx` - New auth wrapper (maintains compatibility)
- ✅ `src/components/SignInForm.jsx` - Now uses Clerk
- ✅ `src/components/SignUpForm.jsx` - Now uses Clerk with email verification
- ✅ All components updated to use ClerkAuthContext

### Files Kept:
- ✅ Supabase client - Still used for database operations
- ✅ All existing auth hooks - `useSupabaseAuth()` still works!
- ✅ Premium status logic - Reads from Clerk metadata

## Setup Clerk Account (Required)

### 1. Create Clerk Account
1. Go to [clerk.com](https://clerk.com) and sign up
2. Create a new application
3. Copy your **Publishable Key**

### 2. Update Environment Variable
Update your `.env.local` with your actual Clerk key:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

### 3. Enable Google OAuth in Clerk Dashboard
1. In Clerk dashboard, go to **User & Authentication → Social Connections**
2. Toggle **Google** ON
3. Configure OAuth settings (Clerk handles credentials automatically)
4. Add your authorized domains:
   - `http://localhost:5173` (development)
   - Your production domain

### 4. Configure Redirect URLs
In Clerk dashboard → **Paths**:
- Sign-in URL: `/`
- Sign-up URL: `/`
- After sign-in: `/`
- After sign-up: `/`

## How It Works

### Sign In Flow:
1. User enters email + password OR clicks "Continue with Google"
2. Clerk handles authentication (including Google OAuth redirect)
3. User is signed in - Clerk session created
4. Premium status read from `user.publicMetadata.premium`

### Sign Up Flow:
1. User enters email + password
2. Clerk sends verification code to email
3. User enters code
4. Account created + personal code assigned
5. User signed in automatically

### Google OAuth:
- No credentials needed on your end
- Clerk manages the entire OAuth flow
- Users redirected to Google → back to your app
- Instant sign-in/sign-up

## Premium Status

To grant premium access to users in Clerk:

1. Go to Clerk Dashboard → **Users**
2. Select a user
3. Go to **Metadata** tab
4. Add to **Public Metadata**:
   ```json
   {
     "premium": true
   }
   ```

## Testing

Start your dev server:
```bash
npm run dev
```

Try:
1. ✅ Email/password sign up (with verification)
2. ✅ Email/password sign in
3. ✅ Google sign in (once configured in Clerk)
4. ✅ Personal code assignment still works
5. ✅ Premium gating still works

## Troubleshooting

### "Missing VITE_CLERK_PUBLISHABLE_KEY"
- Make sure `.env.local` exists with your key
- Restart dev server after adding/changing env vars

### Google OAuth not showing
- Enable Google in Clerk dashboard first
- Check that domains are authorized

### User not signing in
- Check browser console for errors
- Verify Clerk key is correct
- Check Clerk dashboard for authentication logs

## Next Steps

1. Sign up for Clerk at [clerk.com](https://clerk.com)
2. Get your publishable key
3. Enable Google OAuth in Clerk dashboard
4. Update `.env.local` with real key
5. Test authentication flows

## Supabase Database

Your Supabase database is **still active** for:
- Personal codes (zone_access_codes table)
- Ask CLE conversations
- Any other data storage

Clerk only handles **authentication** - Supabase handles **data**.
