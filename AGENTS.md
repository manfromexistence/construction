# AGENTS.md - AI Agent Instructions for QUADRA EDMS

> **For Codex-CLI, GPT-5.4, or any AI agent working on this project**

---

## 🎯 PROJECT OVERVIEW

**Project:** QUADRA Construction EDMS (Electronic Document Management System)  
**Location:** `F:/construction/`  
**Tech Stack:** Next.js 16.2, React 19, TypeScript 5.9, Drizzle ORM, PostgreSQL (Neon), Better Auth  
**Status:** 85% Complete - Core features built, admin features needed  
**Goal:** Build the most unique, classy, and feature-complete construction EDMS

---

## 🚨 CRITICAL PRIORITY TASKS

### ✅ TASK 1: Admin User Management (DO THIS FIRST)

**Problem:** Admin can only VIEW users, cannot edit roles or manage users.

**What to Build:**

#### 1. Create Admin Actions
**File:** `actions/admin-users.ts` (NEW)

Functions needed:
- `updateUserRole(userId, role)` - Change user role
- `updateUserDetails(userId, data)` - Update organization, job title, phone, department
- `toggleUserStatus(userId, isActive)` - Activate/deactivate user
- `deleteUser(userId)` - Delete user account
- `getUserActivitySummary(userId)` - Get user statistics

Security checks:
- Only admins can edit users
- Cannot self-demote from admin
- Cannot delete last admin
- Cannot self-deactivate
- Log all actions to activity log

#### 2. Create Edit UI Component
**File:** `components/edms/admin-user-edit-sheet.tsx` (NEW)

Features:
- Sheet/dialog with form
- Dropdown to change role (admin, client, pmc, vendor, subcontractor, user)
- Input fields for organization, job title, phone, department
- Toggle for active/inactive status
- Delete button with confirmation dialog
- Save button that calls admin actions
- Loading states and error handling

#### 3. Update Admin Users Page
**File:** `app/dashboard/admin/users/page.tsx` (MODIFY)

Add:
- Edit button for each user row
- Search/filter functionality
- Sort by columns
- Bulk select checkboxes
- Bulk actions dropdown
- Export to CSV button

---

## 📊 ADDITIONAL FEATURES NEEDED

### Task 2: User Activity Statistics
- Show documents uploaded count
- Show workflows created count
- Show comments made count
- Show projects member of count

### Task 3: Bulk User Operations
- Select multiple users with checkboxes
- Bulk change role
- Bulk activate/deactivate
- Bulk delete with confirmation

### Task 4: System Analytics Dashboard
**File:** `app/dashboard/admin/analytics/page.tsx` (NEW)

Charts to show:
- Documents uploaded over time (line chart)
- Workflows by status (pie chart)
- User growth over time (line chart)
- Most active users (bar chart)
- Most active projects (bar chart)

Use Recharts library (already installed).

### Task 5: Advanced Search
**File:** `app/dashboard/search/page.tsx` (ENHANCE)

Add:
- Full-text search across documents, comments, workflows
- Advanced filters (date range, file type, status, uploader)
- Save search queries
- Search history

---

## 📁 PROJECT STRUCTURE

```
construction/
├── app/
│   ├── dashboard/
│   │   ├── admin/          # Admin pages
│   │   │   ├── users/      # User management (ENHANCE THIS)
│   │   │   ├── analytics/  # Analytics (CREATE THIS)
│   │   │   └── page.tsx    # Admin dashboard
│   │   ├── documents/      # Document management
│   │   ├── workflows/      # Workflow management
│   │   ├── projects/       # Project management
│   │   └── transmittals/   # Transmittal management
│   └── api/                # API routes
├── actions/                # Server actions
│   ├── documents.ts        # ✅ Complete
│   ├── workflows.ts        # ✅ Complete
│   ├── projects.ts         # ✅ Complete
│   ├── users.ts            # ✅ Complete
│   └── admin-users.ts      # ❌ CREATE THIS
├── components/
│   ├── edms/               # EDMS components
│   │   ├── admin-user-edit-sheet.tsx  # ❌ CREATE THIS
│   │   ├── document-*.tsx  # ✅ Complete
│   │   └── workflow-*.tsx  # ✅ Complete
│   └── ui/                 # Shadcn UI components
├── lib/
│   ├── edms/               # EDMS business logic
│   │   ├── rbac.ts         # ✅ Role-based access control
│   │   ├── session.ts      # ✅ Session management
│   │   └── notifications.ts # ✅ Notification logic
│   └── shared.ts           # ✅ Shared utilities
├── db/
│   ├── schema/             # Database schemas
│   │   ├── users.ts        # ✅ User schema
│   │   ├── documents.ts    # ✅ Document schemas
│   │   ├── workflows.ts    # ✅ Workflow schemas
│   │   └── projects.ts     # ✅ Project schemas
│   └── index.ts            # ✅ Database connection
└── hexed/                  # Documentation (DO NOT MODIFY)
```

---

## 🔧 TECHNICAL REQUIREMENTS

### Code Standards
- Use TypeScript strictly (no `any` types)
- Use Zod for validation
- Use `ActionResult<T>` pattern for server actions
- Use `requireEdmsRole("admin")` for permission checks
- Log all admin actions with `logEdmsActivity()`
- Use `revalidatePath()` after data changes
- Use `useTransition()` for loading states
- Use `toast()` for user feedback

### UI Standards
- Use Shadcn UI components
- Follow existing design patterns
- Mobile-first responsive design
- Use Tailwind CSS classes
- Add loading states
- Add error states
- Add empty states

### Security
- Only admins can access admin routes
- Validate all inputs with Zod
- Prevent self-demotion
- Prevent last admin deletion
- Prevent self-deactivation
- Log all admin actions

---

## 📝 COMMANDS

### Development
```bash
npm run dev          # Start dev server
npm run db:studio    # Open database studio
npm run lint         # Run linter
npm run format       # Format code
```

### Database
```bash
npm run db:push      # Push schema to database
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
```

---

## ✅ TESTING CHECKLIST

Before marking complete:
- [ ] Admin can edit user roles
- [ ] Admin can edit user details
- [ ] Admin can activate/deactivate users
- [ ] Admin can delete users
- [ ] Cannot delete last admin
- [ ] Cannot self-demote
- [ ] Cannot self-deactivate
- [ ] All actions are logged
- [ ] UI is responsive on mobile
- [ ] No TypeScript errors
- [ ] No console errors

---

## 🚫 RULES

1. **Never create markdown files in root** - Only DX.md, AGENTS.md, README.md allowed
2. **All documentation goes in `hexed/` folder**
3. **Don't break existing features** - Test thoroughly
4. **Follow existing patterns** - Look at similar components
5. **Use TypeScript strictly** - No `any` types
6. **Mobile responsive** - Test on mobile
7. **Security first** - Always check permissions

---

## 📚 REFERENCE

Detailed documentation in `hexed/` folder:
- `hexed/AGENT.md` - Complete implementation guide
- `hexed/BRUTAL_CHECK_RESULTS.md` - Feature analysis
- `hexed/ADMIN_POWERS_ANALYSIS.md` - Admin requirements
- `hexed/DATABASE.md` - Database schema

---

## 🎯 SUCCESS CRITERIA

Complete when:
1. ✅ Admin can fully manage users (edit, activate, delete)
2. ✅ Admin can view user activity statistics
3. ✅ Admin can perform bulk operations
4. ✅ Analytics dashboard shows charts
5. ✅ All features tested and working
6. ✅ No errors in console
7. ✅ Mobile responsive
8. ✅ Client is happy

---

## 🚀 GET STARTED

1. Read this file completely
2. Read `hexed/AGENT.md` for detailed instructions
3. Start with Task 1 (Admin user management)
4. Create `actions/admin-users.ts`
5. Create `components/edms/admin-user-edit-sheet.tsx`
6. Update `app/dashboard/admin/users/page.tsx`
7. Test thoroughly
8. Move to next task

**Let's build the best EDMS! 🎨✨**
