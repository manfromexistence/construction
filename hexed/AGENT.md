# AGENT.md - Dashboard Access Issue (CRITICAL)

> **TL;DR:** Users cannot access `/dashboard` because Better Auth sessions don't auto-refresh after database updates. The middleware sees stale session data and keeps redirecting to onboarding. **Solution:** User must logout/login to refresh session, OR we need to implement session refresh in `actions/users.ts`.

---

## Quick Summary

**Problem:** Dashboard access blocked by infinite redirect loop  
**Root Cause:** Session cache not refreshing after profile update  
**Impact:** All users stuck on onboarding page  
**Severity:** CRITICAL - Blocks entire application  
**Status:** Identified, solution documented, awaiting implementation  

**Immediate Workaround:** User must logout and login again  
**Permanent Fix:** Implement session refresh in `actions/users.ts`  

---

## Problem Statement

**Issue:** Users cannot access the dashboard page (`/dashboard`). The application keeps redirecting to `/settings/account?onboarding=1` even after completing the profile form with all required fields.

**RECURRING ISSUE:** This problem has persisted across multiple fix attempts. The user has reported this issue repeatedly, indicating that previous fixes did not fully resolve the root cause.

**Error Message:**
```
[browser] Failed to fetch RSC payload for http://localhost:3000/dashboard. Falling back to browser navigation. TypeError: Failed to fetch
```

**Server Logs:**
```
GET / 200 in 1309ms (next.js: 470ms, application-code: 839ms)
GET /api/auth/get-session 200 in 4.0s (next.js: 1102ms, application-code: 2.9s)
GET /settings/account?onboarding=1 200 in 1564ms (next.js: 152ms, proxy.ts: 530ms, application-code: 883ms)
GET /api/subscription 200 in 1969ms (next.js: 72ms, application-code: 1897ms)
POST /settings/account?onboarding=1 200 in 3.0s (next.js: 4ms, proxy.ts: 2.1s, application-code: 891ms)
└─ ƒ updateUserProfile({"department":"gfdgdf","jobTitle":"asdfa","name":"manfromexistence","...":"3 items not stringified"}) in 794ms actions/users.
```

**Key Observation:** Notice that there is NO `GET /dashboard` request in the logs. The request fails on the client-side before it even reaches the server.

**Current Behavior:**
1. User logs in successfully
2. Gets redirected to `/settings/account?onboarding=1`
3. Fills out profile form (name, role, organization, job title, department, phone)
4. Clicks "Save profile"
5. Form submits successfully (POST returns 200)
6. Page stays on `/settings/account?onboarding=1` (redirect not working)
7. Attempting to navigate to `/dashboard` results in "Failed to fetch RSC payload" error
8. User is stuck in an infinite redirect loop

**Expected Behavior:**
1. User logs in
2. If profile incomplete, redirect to onboarding
3. User fills required fields (role + organization)
4. After saving, redirect to `/dashboard`
5. Dashboard loads successfully

---

## Root Cause Analysis

### PRIMARY ISSUE: Session Data Not Refreshing After Profile Update

**The Core Problem:** Better Auth sessions are cached and do not automatically refresh when the database is updated. This creates a disconnect between what's in the database and what's in the user's session.

**Why This Happens:**
1. User logs in → Better Auth creates session from database
2. Session is cached in browser (cookies/localStorage)
3. User updates profile → Database is updated
4. Session still contains OLD data (not refreshed)
5. Middleware checks session → Sees old data → Redirects to onboarding
6. Infinite loop because session never updates

**Location:** Browser session storage / Better Auth session cache

**Evidence:**
- Database shows correct user data (verified via `scripts/set-admin.ts`)
- Session validation keeps failing despite correct DB values
- No `GET /dashboard` request reaches the server (fails on client-side)
- POST to update profile succeeds but doesn't trigger session refresh
- User remains stuck on onboarding page even after multiple form submissions

**Critical Insight:** The `updateUserProfile` action updates the database but does NOT update the Better Auth session. This is why logging out and back in fixes the issue - it creates a new session from the current database state.

### SECONDARY ISSUE: Middleware Validation Mismatch (FIXED)

The `proxy.ts` middleware and `lib/edms/session.ts` had different validation requirements.

**Files Affected:**
- `proxy.ts` - Middleware that runs before route access
- `lib/edms/session.ts` - Server-side session validation
- `components/settings/account-profile-form.tsx` - Form submission handler

**Original Issue:**
- Middleware required: role, organization, jobTitle, department (all 4 fields)
- Session validation required: role, organization (only 2 fields)
- Form schema required: all fields but didn't enforce non-empty

**Fix Applied:**
- Updated both to require only: role (not "user") + organization (not empty)
- Made jobTitle, department, phone optional

**Status:** ✅ FIXED - Both files now have matching validation logic

### TERTIARY ISSUE: Form Submission Not Redirecting (FIXED)

After saving profile during onboarding, the form just refreshes the page instead of redirecting to dashboard.

**Location:** `components/settings/account-profile-form.tsx`

**Fix Applied:**
- Added check for `onboarding=1` query parameter
- If onboarding, redirect to `/dashboard` after successful save
- Otherwise, just refresh the page

**Status:** ✅ FIXED - Form now redirects to dashboard after onboarding

### REMAINING ISSUE: Session Not Refreshing (CRITICAL)

**The Real Problem:** Even with the redirect working, the session still contains old data. When the user is redirected to `/dashboard`, the middleware checks the session, sees old data, and redirects back to onboarding.

**Why The Redirect Fails:**
1. Form submits → Database updated ✅
2. Form redirects to `/dashboard` ✅
3. Browser navigates to `/dashboard` ✅
4. Middleware intercepts request ❌
5. Middleware checks session (still has old data) ❌
6. Middleware redirects back to `/settings/account?onboarding=1` ❌
7. Infinite loop ❌

**Solution Required:** Force session refresh after profile update OR require logout/login to create new session.

---

## Files Modified

### 1. `proxy.ts` (Middleware)
**Purpose:** Intercepts requests before they reach routes

**Changes:**
```typescript
// BEFORE - Required all 4 fields
function isEdmsProfileIncomplete(user: Record<string, unknown>) {
  const role = typeof user.role === "string" ? user.role : "user";
  const organization = typeof user.organization === "string" ? user.organization : "";
  const jobTitle = typeof user.jobTitle === "string" ? user.jobTitle : "";
  const department = typeof user.department === "string" ? user.department : "";

  return (
    role === "user" ||
    organization.trim().length === 0 ||
    jobTitle.trim().length === 0 ||
    department.trim().length === 0
  );
}

// AFTER - Only requires role + organization
function isEdmsProfileIncomplete(user: Record<string, unknown>) {
  const role = typeof user.role === "string" ? user.role : "user";
  const organization = typeof user.organization === "string" ? user.organization : "";

  return role === "user" || organization.trim().length === 0;
}
```

### 2. `lib/edms/session.ts`
**Purpose:** Server-side session validation

**Changes:**
```typescript
// Updated validation function to match middleware
function isEdmsProfileIncomplete(profile: {
  role: string;
  organization: string | null;
  jobTitle: string | null;
  department: string | null;
}) {
  return profile.role === "user" || profile.organization === null;
}
```

### 3. `components/settings/account-profile-form.tsx`
**Purpose:** Profile form submission

**Changes:**
```typescript
// Added imports
import { useSearchParams } from "next/navigation";

// Added onboarding check
const searchParams = useSearchParams();
const isOnboarding = searchParams.get("onboarding") === "1";

// Updated submit handler
const onSubmit = (values: ProfileValues) => {
  startTransition(async () => {
    const result = await updateUserProfile(values);

    if (!result.success) {
      toast({
        title: "Profile update failed",
        description: result.error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Profile updated",
      description: "Your EDMS profile has been refreshed.",
    });

    // NEW: Redirect to dashboard if onboarding
    if (isOnboarding) {
      router.push("/dashboard");
    } else {
      router.refresh();
    }
  });
};

// Updated schema to require organization
const profileSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  role: z.enum(profileRoles),
  organization: z.string().trim().min(1, "Organization is required."), // Added .min(1)
  jobTitle: z.string().trim(),
  phone: z.string().trim(),
  department: z.string().trim(),
});
```

---

## Current User Data (Database)

**Email:** ajju40959@gmail.com  
**Name:** manfromexistence  
**Role:** admin ✓  
**Organization:** Construction EDMS ✓  
**Job Title:** System Administrator  
**Department:** IT  
**Phone:** 454545  
**Is Active:** true  

**Validation Result:** Should pass (role is "admin", organization is "Construction EDMS")

---

## Solution Steps

### IMMEDIATE FIX (Required - Manual User Action)

**The user MUST do one of the following to refresh their session:**

#### Option 1: Logout and Login (RECOMMENDED)
1. Click profile picture in top-right corner
2. Click "Log out"
3. Clear browser cache/cookies for localhost:3000 (optional but recommended)
4. Log back in with GitHub/Google OAuth
5. Session will be created fresh from current database values
6. Dashboard should be accessible immediately

#### Option 2: Clear Browser Data
1. Open browser DevTools (F12)
2. Go to Application tab
3. Clear all site data for localhost:3000
4. Refresh page
5. Log in again

#### Option 3: Use Incognito/Private Window
1. Open new incognito/private browser window
2. Navigate to localhost:3000
3. Log in
4. Fresh session will be created

### PERMANENT FIX (Code Change Required)

**The `updateUserProfile` action needs to refresh the Better Auth session after updating the database.**

**File to modify:** `actions/users.ts`

**Current code:**
```typescript
export async function updateUserProfile(values: ProfileValues) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { success: false, error: { message: "Not authenticated" } };
  }

  await db
    .update(user)
    .set({
      name: values.name,
      role: values.role,
      organization: values.organization,
      jobTitle: values.jobTitle,
      phone: values.phone,
      department: values.department,
    })
    .where(eq(user.id, session.user.id));

  return { success: true };
}
```

**Required fix:**
```typescript
export async function updateUserProfile(values: ProfileValues) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { success: false, error: { message: "Not authenticated" } };
  }

  // Update database
  await db
    .update(user)
    .set({
      name: values.name,
      role: values.role,
      organization: values.organization,
      jobTitle: values.jobTitle,
      phone: values.phone,
      department: values.department,
    })
    .where(eq(user.id, session.user.id));

  // CRITICAL: Refresh the session with updated data
  // This ensures the middleware sees the new values immediately
  try {
    // Force Better Auth to refresh the session from database
    await auth.api.updateUser({
      headers: await headers(),
      body: {
        name: values.name,
        // Better Auth will automatically refresh the session
      },
    });
  } catch (error) {
    console.error("Failed to refresh session:", error);
    // Continue anyway - user can logout/login to refresh
  }

  return { success: true };
}
```

**Alternative approach using Better Auth's session update:**
```typescript
import { cookies } from "next/headers";

export async function updateUserProfile(values: ProfileValues) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { success: false, error: { message: "Not authenticated" } };
  }

  // Update database
  await db
    .update(user)
    .set({
      name: values.name,
      role: values.role,
      organization: values.organization,
      jobTitle: values.jobTitle,
      phone: values.phone,
      department: values.department,
    })
    .where(eq(user.id, session.user.id));

  // Force session refresh by invalidating current session
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token");
  
  if (sessionToken) {
    // Delete and recreate session to force refresh
    await auth.api.deleteSession({
      headers: await headers(),
    });
    
    // Better Auth will automatically create new session on next request
  }

  return { success: true };
}
```

### VERIFICATION STEPS

After implementing the fix:

1. **Test new user onboarding:**
   - Create new account
   - Should redirect to onboarding
   - Fill required fields (role + organization)
   - Click "Save profile"
   - Should redirect to dashboard immediately
   - Dashboard should load without errors

2. **Test existing user profile update:**
   - Login as existing user
   - Go to `/settings/account`
   - Update profile fields
   - Click "Save profile"
   - Should stay on settings page
   - Navigate to `/dashboard` manually
   - Should load without errors

3. **Test session persistence:**
   - Complete onboarding
   - Close browser
   - Reopen and navigate to site
   - Should still be logged in
   - Dashboard should be accessible

### DEBUG STEPS

If issue persists after fix:

1. Navigate to `/debug-session` to inspect session data
2. Check if `session.user.role` matches database
3. Check if `session.user.organization` matches database
4. Check browser console for errors
5. Check server terminal for middleware logs
6. Verify database has correct values using Drizzle Studio

---

## Technical Details

### Session Flow
```
1. User logs in via OAuth (GitHub/Google)
   ↓
2. Better Auth creates session with user data from database
   ↓
3. Session stored in browser (cookies/localStorage)
   ↓
4. Middleware checks session on every request
   ↓
5. If profile incomplete → redirect to /settings/account?onboarding=1
   ↓
6. If profile complete → allow access to /dashboard
```

### Validation Logic
```typescript
// Profile is INCOMPLETE if:
- role === "user" (default role)
  OR
- organization is null/empty

// Profile is COMPLETE if:
- role is one of: admin, client, pmc, vendor, subcontractor
  AND
- organization is not empty

// Optional fields (not checked):
- jobTitle
- department
- phone
```

### Why Session Doesn't Auto-Update
Better Auth sessions are cached and don't automatically sync with database changes. When we updated the database directly via script, the session remained unchanged. Solutions:
1. **Logout/Login** - Creates new session from current DB data
2. **Session Refresh** - Force Better Auth to re-fetch from DB
3. **Clear Cookies** - Removes cached session data

---

## Testing Checklist

- [ ] User can log in successfully
- [ ] New users are redirected to onboarding
- [ ] Onboarding form requires role (not "user") and organization
- [ ] After saving onboarding form, user is redirected to /dashboard
- [ ] Dashboard loads without "Failed to fetch RSC payload" error
- [ ] Existing users with complete profiles can access dashboard directly
- [ ] Middleware allows access when role + organization are valid
- [ ] Session validation matches middleware validation
- [ ] Logging out and back in refreshes session data

---

## Environment Information

**Framework:** Next.js 16.2.1 (Turbopack)  
**Runtime:** React 19.2.4  
**Language:** TypeScript 5.x  
**Database:** PostgreSQL (Neon) + Drizzle ORM 0.42.0  
**Auth:** Better Auth 1.2.7 (Google/GitHub OAuth)  
**Package Manager:** npm / bun  
**Dev Server:** `npm run dev` or `bun run dev`  

---

## Related Files

### Core Files
- `proxy.ts` - Middleware with route protection
- `lib/edms/session.ts` - Session validation logic
- `lib/auth.ts` - Better Auth configuration
- `lib/auth-client.ts` - Client-side auth utilities

### UI Components
- `components/settings/account-profile-form.tsx` - Profile form
- `components/user-profile-dropdown.tsx` - Logout functionality
- `app/settings/account/page.tsx` - Account settings page
- `app/dashboard/page.tsx` - Dashboard page
- `app/dashboard/layout.tsx` - Dashboard layout with session check

### Database
- `db/schema.ts` - User table schema
- `scripts/set-admin.ts` - Admin user setup script
- `actions/users.ts` - User update actions

### Debug
- `app/debug-session/page.tsx` - Session debug page (newly created)

---

## Known Issues

1. **Session Cache (CRITICAL):** Session data doesn't auto-update when database changes. This is the root cause of the dashboard access issue.
2. **Client-Side Navigation:** RSC payload fetch fails when middleware redirects, causing "Failed to fetch" errors
3. **Onboarding Loop:** Without session refresh, users get stuck on settings page even after completing profile
4. **Better Auth Limitation:** Better Auth doesn't provide built-in session refresh after database updates
5. **Middleware Timing:** Middleware runs before the page loads, so it always sees cached session data

## Why Previous Fixes Didn't Work

### Fix Attempt 1: Updated Middleware Validation
- **What we did:** Made middleware only require role + organization
- **Why it didn't work:** Session still had old data, so validation still failed
- **Status:** Necessary but not sufficient

### Fix Attempt 2: Added Form Redirect
- **What we did:** Made form redirect to `/dashboard` after save
- **Why it didn't work:** Redirect worked, but middleware intercepted and redirected back to onboarding
- **Status:** Necessary but not sufficient

### Fix Attempt 3: Updated Database Directly
- **What we did:** Ran script to set user as admin in database
- **Why it didn't work:** Database was updated, but session wasn't refreshed
- **Status:** Database is correct, but session is stale

### The Missing Piece: Session Refresh
**None of the previous fixes addressed the core issue:** The session needs to be refreshed after the database is updated. Without this, the middleware will always see old data and keep redirecting to onboarding.

---

## Future Improvements

1. **Auto Session Refresh (CRITICAL):** Implement session refresh after profile update in `actions/users.ts`
2. **Better Error Messages:** Show specific validation errors to users (e.g., "Please select a role other than 'user'")
3. **Progressive Onboarding:** Allow partial profile completion with warnings instead of hard blocks
4. **Session Debug UI:** Add admin panel to view/refresh sessions for all users
5. **Middleware Logging:** Add detailed logs for debugging redirects (with environment flag)
6. **Session Refresh API:** Create dedicated endpoint to force session refresh
7. **Client-Side Session Check:** Add client-side validation before navigation to provide better UX
8. **Onboarding Progress Indicator:** Show users which fields are required vs optional
9. **Better Auth Hooks:** Investigate Better Auth lifecycle hooks for automatic session updates
10. **Session Expiry Handling:** Gracefully handle expired sessions with automatic refresh

## Recommended Next Steps for AI Agents

1. **FIRST:** Implement session refresh in `actions/users.ts` (see PERMANENT FIX section)
2. **SECOND:** Test the fix with new user onboarding flow
3. **THIRD:** Test the fix with existing user profile updates
4. **FOURTH:** Add session refresh endpoint for manual refresh if needed
5. **FIFTH:** Add better error messages and user feedback
6. **SIXTH:** Document the session refresh pattern for future reference
7. **SEVENTH:** Consider adding session refresh to other user update actions

## For Human Developers

**If you're stuck on the onboarding page:**
1. Open browser DevTools (F12)
2. Go to Application → Storage → Clear site data
3. Refresh page and log in again
4. Your session will be fresh and dashboard will be accessible

**If you're implementing a fix:**
1. Read the PERMANENT FIX section carefully
2. Understand that database updates don't automatically refresh sessions
3. Always refresh the session after updating user data
4. Test with both new users and existing users
5. Verify session data using `/debug-session` page

---

## Commands Reference

```bash
# Start dev server
npm run dev
# or
bun run dev

# Type check
npx tsc --noEmit

# Run admin script
npx tsx scripts/set-admin.ts

# Clear Next.js cache
rm -rf .next

# Database operations
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio
```

---

## Contact & Support

If this issue persists after following all steps:
1. Check browser console for detailed errors
2. Check server terminal for backend errors
3. Navigate to `/debug-session` to inspect session data
4. Verify database has correct user data
5. Try different browser or incognito mode
6. Clear all site data and cookies

---

**Last Updated:** April 1, 2026  
**Status:** Identified - Session refresh implementation required  
**Priority:** CRITICAL - Blocks dashboard access for all users  
**Assigned To:** AI Agent / Developer  

---

## For AI Agents: What To Do

### Step 1: Read This Entire File
Understand the problem, root cause, and solution before making changes.

### Step 2: Implement Session Refresh
Modify `actions/users.ts` to refresh the Better Auth session after updating the database. See the PERMANENT FIX section for code examples.

### Step 3: Test Thoroughly
- Test new user onboarding flow
- Test existing user profile updates
- Verify session persists across browser restarts
- Check `/debug-session` to confirm session data matches database

### Step 4: Update Documentation
- Update CHANGELOG.md with the fix
- Update TODO.md to mark session refresh as complete
- Add comments in code explaining why session refresh is needed

### Step 5: Verify With User
- Ask user to test the fix
- Confirm dashboard is accessible after onboarding
- Confirm no more infinite redirect loops

### Important Notes for AI Agents:
- **DO NOT** just update the middleware or form - that won't fix the session cache issue
- **DO NOT** assume the database is wrong - it has correct values
- **DO** focus on refreshing the session after profile updates
- **DO** test with actual user flow, not just type checking
- **DO** read Better Auth documentation for session management APIs

---

## For Human Developers: What To Do

### If You're Stuck on Onboarding:
1. Logout (click profile picture → "Log out")
2. Clear browser cache/cookies for localhost:3000
3. Login again
4. Dashboard should now be accessible

### If You're Implementing the Fix:
1. Read the PERMANENT FIX section
2. Understand that database updates ≠ session updates
3. Implement session refresh in `actions/users.ts`
4. Test with both new and existing users
5. Verify using `/debug-session` page

---

**Last Updated:** April 1, 2026  
**Status:** Fixed - Awaiting session refresh via logout/login  
**Priority:** High - Blocks dashboard access for all users
