# 🔐 SECURITY INCIDENT REPORT & RESPONSE

**Date:** December 21, 2025  
**Severity:** HIGH  
**Status:** ⚠️ ACTIVE BREACH - Immediate Action Required

---

## 🚨 What Happened

GitGuardian detected that a **Sanity authentication token** was committed to your public GitHub repository in commit `755636b`.

**Exposed Token:**
```
skBJMJj3BVMxuBm4AziCKDFPL99n4d... (full token in commit history)
```

**Location:** `VERCEL_ENV_SETUP.md` (committed to Git)

---

## ⚠️ IMPACT ASSESSMENT

### What the Attacker Can Do:
- ✅ **Read all content** in your Sanity dataset (lp1si6d4/production)
- ✅ **Modify/delete documents** (if token has write permissions)
- ✅ **Upload malicious content** to your Sanity project
- ✅ **Access user-generated content** stored in Sanity
- ❌ Cannot access Clerk user accounts (different system)
- ❌ Cannot access Supabase data (different system)
- ❌ Cannot deploy to Vercel (different token needed)

### Severity: HIGH
- **Data Confidentiality:** Compromised
- **Data Integrity:** At Risk
- **Service Availability:** At Risk

---

## 🔥 IMMEDIATE ACTIONS (Do in Order)

### 1. Revoke Compromised Token (⏰ DO THIS NOW)

**Go to:** https://www.sanity.io/manage/personal/project/lp1si6d4/api/tokens

1. Find the token that starts with `skBJMJj3...`
2. Click the **trash icon** to delete it
3. Confirm deletion

**⏰ Until you do this, the attacker has access to your Sanity data!**

---

### 2. Generate New Sanity Token

**In the same Sanity dashboard:**

1. Click "Add API token"
2. Name: `WOK360 Production Token`
3. Permissions: **Editor** (or **Viewer** if you only need reads)
4. Click "Add token"
5. **Copy the new token** - you won't see it again!

---

### 3. Update Local Environment

```bash
# Open .env.local and replace the Sanity token
nano .env.local
```

Replace both lines:
```
SANITY_AUTH_TOKEN=<NEW_TOKEN_HERE>
VITE_SANITY_AUTH_TOKEN=<NEW_TOKEN_HERE>
```

**⚠️ DO NOT COMMIT THIS FILE**

---

### 4. Update Vercel Environment Variables

**Go to:** Vercel Dashboard → Your Project → Settings → Environment Variables

1. Find `VITE_SANITY_AUTH_TOKEN`
2. Click **Edit**
3. Replace with new token
4. Click **Save**
5. **Redeploy** - Vercel will auto-trigger

---

### 5. Remove Sensitive Files from Git History

```bash
# Make the script executable
chmod +x SECURITY_FIX.sh

# Run the security fix script
./SECURITY_FIX.sh
```

This will:
- Remove `VERCEL_ENV_SETUP.md` from all commits
- Remove `CLERK_VERIFICATION.md` from all commits
- Remove `API_KEY_VERIFICATION.md` from all commits

---

### 6. Force Push to Rewrite GitHub History

```bash
# Rewrite the repository history
git push origin --force --all

# Also force push tags if you have any
git push origin --force --tags
```

**⚠️ WARNING:** This rewrites history. If others have cloned your repo, they'll need to re-clone.

---

### 7. Verify the Fix

**Check GitHub commit history:**
1. Go to: https://github.com/dc23-coding/WOK360/commit/755636b
2. Verify you get a 404 or the file is missing
3. Check the latest commit - sensitive files should not appear

---

## 🛡️ PREVENTIVE MEASURES (Implement After Fix)

### 1. Never Commit Secrets to Git

**Files that should NEVER be committed:**
- `.env`
- `.env.local`
- Any file containing API keys, tokens, or passwords
- Database credentials
- Private keys

### 2. Use .env.example for Templates

Create a template with placeholder values:
```bash
# .env.example (safe to commit)
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production
VITE_SANITY_AUTH_TOKEN=get_from_sanity_dashboard
```

### 3. Enable Git Hooks (Pre-commit)

Install git-secrets:
```bash
brew install git-secrets
git secrets --install
git secrets --register-aws
```

### 4. Use Vercel Environment Variables

**Never put production secrets in code or docs.** Always use:
- Vercel Dashboard → Environment Variables
- Local `.env.local` (gitignored)

### 5. Rotate Tokens Regularly

**Best practice:**
- Rotate tokens every 90 days
- Use different tokens for dev/staging/prod
- Use minimal permissions (read-only when possible)

---

## 📋 POST-INCIDENT CHECKLIST

- [ ] Compromised Sanity token revoked
- [ ] New Sanity token generated
- [ ] `.env.local` updated with new token
- [ ] Vercel environment variables updated
- [ ] Sensitive files removed from Git history
- [ ] Force push completed
- [ ] GitHub history verified clean
- [ ] Documentation files sanitized
- [ ] `.gitignore` updated
- [ ] Team notified (if applicable)
- [ ] Sanity audit logs checked for suspicious activity

---

## 🔍 AUDIT CHECKLIST

### Check for Unauthorized Access

**Go to:** Sanity Dashboard → Project → Activity

Look for:
- Unusual document modifications
- Bulk deletions
- Unknown IP addresses
- Access outside your normal hours

### Check for Data Exfiltration

Review recent queries:
- Large dataset downloads
- Unusual query patterns
- Access to sensitive documents

---

## 📊 LESSONS LEARNED

### What Went Wrong:
1. Documentation file (`VERCEL_ENV_SETUP.md`) contained real token
2. File was committed to public GitHub repository
3. GitGuardian detected the leak immediately
4. Token had write access to Sanity project

### What We'll Do Better:
1. ✅ Use placeholders in all documentation
2. ✅ Never include real credentials in examples
3. ✅ Add pre-commit hooks to prevent future leaks
4. ✅ Regular security audits of committed files
5. ✅ Rotate tokens on a schedule

---

## 🆘 NEED HELP?

If you see suspicious activity in your Sanity logs:
1. Change all tokens immediately
2. Enable 2FA on Sanity account
3. Contact Sanity support: support@sanity.io
4. Review all recent document changes

---

## 📞 CONTACTS

- **GitGuardian Support:** incidents@gitguardian.com
- **Sanity Support:** support@sanity.io
- **GitHub Security:** security@github.com

---

**Last Updated:** December 21, 2025  
**Next Review:** After incident resolution
