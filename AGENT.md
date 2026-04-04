# AGENT INSTRUCTIONS FOR CONSTRUCTION EDMS COMPLETION
## For GPT-5.4 Codex or Advanced AI Agent

---

## 🎯 PROJECT OVERVIEW

**Project Name:** QUADRA Construction EDMS (Electronic Document Management System)  
**Tech Stack:** Next.js 16, React 19, TypeScript, Drizzle ORM, PostgreSQL (Neon), Better Auth  
**Current Status:** 85% Complete - Core features implemented but untested  
**Goal:** Make this the most unique, classy, and feature-complete construction EDMS

---

## 📋 CURRENT STATE ANALYSIS

### ✅ What's Already Built (DO NOT REBUILD)

1. **Database Schema** - Complete
   - Users with roles (admin, client, pmc, vendor, subcontractor, user)
   - Projects with members
   - Documents with versions
   - Workflows with multi-step approvals
   - Comments and notifications
   - Activity logging

2. **Role-Based Access Control (RBAC)** - Complete
   - Role hierarchy enforcement
   - Permission checks
   - Route protection

3. **Document Management** - Complete
   - Upload documents
   - Version control
   - Status tracking (draft → submitted → under_review → approved/rejected)
   - PDF preview
   - Image attachments (ImgBB integration)

4. **Workflow System** - Complete
   - Create review workflows
   - Assign reviewers
   - Approve/Reject/Comment
   - Multi-step approvals
   - Automatic status updates

5. **Notification System** - Complete
   - In-app notifications
   - Email notifications (Resend)
   - User preferences

6. **UI Components** - Complete
   - Shadcn UI components
   - Responsive design
   - Dark/light theme
   - Professional styling

---

## ❌ CRITICAL GAPS TO FIX

### 1. ADMIN USER MANAGEMENT (HIGHEST PRIORITY)

**Current State:**
- Admin can VIEW users at `/dashboard/admin/users`
- Admin CANNOT edit user roles or access levels
- No UI to change user roles
- No bulk user management

**What You Must Build:**

#### A. User Edit Dialog/Sheet
**Location:** `components/edms/admin-user-edit-sheet.tsx`

```typescript
// Features Required:
- Edit user role (dropdown: admin, client, pmc, vendor, subcontractor, user)
- Edit organization
- Edit job title
- Edit phone
- Edit department
- Toggle user active/inactive status
- Delete user (with confirmation)
- View user's projects
- View user's documents
- View user's activity log
```

#### B. Admin User Management Actions
**Location:** `actions/admin-users.ts`

```typescript
// Required Functions:
export async function updateUserRole(userId: string, role: EdmsRole): Promise<ActionResult<boolean>>
export async function updateUserDetails(userId: string, data: UserUpdateInput): Promise<ActionResult<boolean>>
export async function toggleUserStatus(userId: string, isActive: boolean): Promise<ActionResult<boolean>>
export async function deleteUser(userId: string): Promise<ActionResult<boolean>>
export async function bulkUpdateUserRoles(updates: Array<{userId: string, role: EdmsRole}>): Promise<ActionResult<boolean>>
export async function getUserActivitySummary(userId: string): Promise<ActionResult<UserActivitySummary>>
```

#### C. Enhanced Admin Users Page
**Location:** `app/dashboard/admin/users/page.tsx`

```typescript
// Add These Features:
- Search/filter users by name, email, role, organization
- Sort by any column
- Bulk select users
- Bulk actions (change role, activate/deactivate, delete)
- Export users to CSV
- User statistics (documents uploaded, workflows completed, etc.)
- Last login timestamp
- Click user row to open edit sheet
```

#### D. Admin User Detail Page
**Location:** `app/dashboard/admin/users/[userId]/page.tsx` (NEW)

```typescript
// Show:
- User profile with edit button
- User's projects (with role in each project)
- User's uploaded documents
- User's workflow activity
- User's comments
- User's notifications
- Activity timeline
- Login history
```

---

### 2. ADVANCED ADMIN FEATURES

#### A. Role Management System
**Location:** `app/dashboard/admin/roles/page.tsx` (NEW)

```typescript
// Features:
- View all roles and their permissions
- Create custom roles (future-proof)
- Edit role permissions
- Assign default permissions per role
- Role hierarchy visualization
```

#### B. System Settings
**Location:** `app/dashboard/admin/settings/page.tsx` (NEW)

```typescript
// Settings to Add:
- Default document statuses (customizable)
- Default workflow templates
- Email notification templates
- File upload limits
- Allowed file types
- Document retention policies
- Audit log retention
- System-wide announcements
```

#### C. Analytics Dashboard
**Location:** `app/dashboard/admin/analytics/page.tsx` (NEW)

```typescript
// Metrics to Show:
- Documents uploaded per day/week/month (chart)
- Workflows completed vs pending (chart)
- Average review time per role
- Most active users
- Most active projects
- Document approval rate
- Rejection reasons (from comments)
- User growth over time
- Storage usage
```

---

### 3. ENHANCED DOCUMENT FEATURES

#### A. Document Templates
**Location:** `app/dashboard/documents/templates/page.tsx` (NEW)

```typescript
// Features:
- Create document templates with pre-filled metadata
- Template categories (RFI, Submittal, Drawing, Specification, etc.)
- Template variables (project name, date, etc.)
- Quick create from template
```

#### B. Document Comparison
**Location:** `components/edms/document-compare-dialog.tsx` (NEW)

```typescript
// Features:
- Compare two versions of a document
- Highlight changes (if PDF)
- Side-by-side view
- Download comparison report
```

#### C. Document Linking
**Location:** Add to existing document detail page

```typescript
// Features:
- Link related documents
- Show document relationships (parent/child, supersedes, references)
- Visual relationship graph
```

#### D. Advanced Search
**Location:** `app/dashboard/search/page.tsx` (ENHANCE)

```typescript
// Add:
- Full-text search in document content (if possible)
- Search in comments
- Search in workflow notes
- Advanced filters (date range, file type, size, uploader, status)
- Save search queries
- Search history
```

---

### 4. WORKFLOW ENHANCEMENTS

#### A. Workflow Templates
**Location:** `app/dashboard/workflows/templates/page.tsx` (NEW)

```typescript
// Features:
- Create reusable workflow templates
- Template with multiple steps
- Default reviewers per role
- Default due dates (e.g., 3 days for review, 5 days for approval)
- Quick create workflow from template
```

#### B. Workflow Analytics
**Location:** Add to workflows page

```typescript
// Show:
- Average time per workflow step
- Bottlenecks (which step takes longest)
- Reviewer performance (average response time)
- Workflow completion rate
```

#### C. Workflow Reminders
**Location:** `lib/edms/workflow-reminders.ts` (NEW)

```typescript
// Features:
- Automatic reminders for overdue workflow steps
- Escalation (notify supervisor if no response in X days)
- Daily digest of pending workflows
```

#### D. Parallel Workflows
**Location:** Enhance existing workflow system

```typescript
// Features:
- Allow multiple reviewers at the same step (all must approve)
- Conditional workflows (if rejected, route to different person)
- Optional steps (can be skipped)
```

---

### 5. PROJECT ENHANCEMENTS

#### A. Project Dashboard
**Location:** `app/dashboard/projects/[projectId]/page.tsx` (ENHANCE)

```typescript
// Add:
- Project timeline (Gantt chart or timeline view)
- Project milestones
- Document submission schedule
- Workflow status overview
- Project team directory with contact info
- Project announcements
- Project files (non-controlled documents)
```

#### B. Project Templates
**Location:** `app/dashboard/projects/templates/page.tsx` (NEW)

```typescript
// Features:
- Create project templates with default members
- Template with default document categories
- Template with default workflow templates
- Quick create project from template
```

#### C. Project Reports
**Location:** `app/dashboard/projects/[projectId]/reports/page.tsx` (NEW)

```typescript
// Reports:
- Document register (all documents in project)
- Workflow status report
- Submittal log
- RFI log
- Transmittal log
- Project activity report
- Export to PDF/Excel
```

---

### 6. TRANSMITTAL ENHANCEMENTS

**Current State:** Basic transmittal system exists but minimal features

#### A. Enhanced Transmittal Creation
**Location:** Enhance existing transmittal components

```typescript
// Add:
- Attach multiple documents
- Add cover letter/notes
- Select recipients (multiple)
- Request acknowledgement
- Set response due date
- Add custom fields
```

#### B. Transmittal Tracking
**Location:** `app/dashboard/transmittals/[transmittalId]/page.tsx` (NEW)

```typescript
// Show:
- Transmittal details
- Attached documents
- Recipients and acknowledgement status
- Response history
- Download transmittal package (ZIP)
- Print transmittal cover sheet
```

---

### 7. COLLABORATION FEATURES

#### A. Real-time Notifications
**Location:** Enhance existing notification system

```typescript
// Add:
- WebSocket for real-time updates
- Toast notifications for new comments
- Badge count on sidebar
- Sound notifications (optional)
```

#### B. @Mentions in Comments
**Location:** Enhance comment system

```typescript
// Features:
- @mention users in comments
- Notify mentioned users
- Autocomplete user names
```

#### C. Document Discussion Threads
**Location:** Add to document detail page

```typescript
// Features:
- Threaded comments (reply to comments)
- Mark comments as resolved
- Filter comments (all, unresolved, mine)
```

---

### 8. MOBILE RESPONSIVENESS

**Current State:** Responsive but not optimized for mobile

#### Tasks:
- Test all pages on mobile devices
- Add mobile-specific navigation (bottom nav bar)
- Optimize tables for mobile (card view)
- Add swipe gestures for actions
- Mobile-friendly file upload
- Mobile document viewer

---

### 9. SECURITY ENHANCEMENTS

#### A. Audit Log Viewer
**Location:** `app/dashboard/admin/audit-log/page.tsx` (NEW)

```typescript
// Features:
- View all system activity
- Filter by user, action, entity type, date range
- Export audit log
- Highlight security events (failed logins, permission changes)
```

#### B. Two-Factor Authentication
**Location:** Integrate with Better Auth

```typescript
// Add:
- Enable 2FA for users
- QR code for authenticator apps
- Backup codes
- Force 2FA for admin users
```

#### C. Session Management
**Location:** `app/settings/security/page.tsx` (NEW)

```typescript
// Features:
- View active sessions
- Revoke sessions
- Session timeout settings
- Login history
```

---

### 10. UNIQUE & CLASSY FEATURES

#### A. AI-Powered Features
**Location:** Various

```typescript
// Ideas:
- AI document summarization (using existing Google AI)
- AI-suggested reviewers based on document type
- AI-generated document descriptions
- AI-powered search (semantic search)
- AI comment sentiment analysis
- AI workflow optimization suggestions
```

#### B. Document OCR
**Location:** `lib/edms/ocr.ts` (NEW)

```typescript
// Features:
- Extract text from scanned PDFs
- Make documents searchable
- Auto-fill metadata from document content
```

#### C. Digital Signatures
**Location:** `components/edms/document-signature.tsx` (NEW)

```typescript
// Features:
- Sign documents digitally
- Signature verification
- Signature audit trail
- Multiple signers
```

#### D. Document Watermarking
**Location:** `lib/edms/watermark.ts` (NEW)

```typescript
// Features:
- Add watermarks to documents (DRAFT, APPROVED, CONFIDENTIAL)
- Custom watermarks per project
- Automatic watermarking based on status
```

#### E. QR Code Generation
**Location:** Add to document detail page

```typescript
// Features:
- Generate QR code for each document
- QR code links to document detail page
- Print QR code labels
- Scan QR code to view document on mobile
```

#### F. Document Expiry & Retention
**Location:** Add to document schema and management

```typescript
// Features:
- Set document expiry dates
- Automatic archival of expired documents
- Retention policies per document type
- Automatic deletion after retention period
```

#### G. Custom Branding
**Location:** `app/dashboard/admin/branding/page.tsx` (NEW)

```typescript
// Features:
- Upload company logo
- Custom color scheme
- Custom email templates
- Custom document headers/footers
- White-label option
```

---

## 🔧 TECHNICAL REQUIREMENTS

### Code Quality Standards

1. **TypeScript Strict Mode**
   - No `any` types
   - Proper type inference
   - Use Zod for validation

2. **Error Handling**
   - Use `ActionResult<T>` pattern
   - Proper error messages
   - Log errors with context

3. **Performance**
   - Use React Server Components where possible
   - Minimize client-side JavaScript
   - Optimize database queries (use indexes)
   - Implement pagination for large lists

4. **Security**
   - Always check user permissions
   - Use `requireEdmsRole()` for protected actions
   - Sanitize user inputs
   - Prevent SQL injection (Drizzle handles this)
   - Validate file uploads

5. **UI/UX**
   - Follow existing design patterns
   - Use Shadcn UI components
   - Maintain consistent spacing and typography
   - Add loading states
   - Add empty states
   - Add error states
   - Mobile-first responsive design

6. **Testing**
   - Write unit tests for critical functions
   - Write integration tests for workflows
   - Test with different user roles
   - Test edge cases

---

## 📁 FILE STRUCTURE CONVENTIONS

```
app/
├── dashboard/
│   ├── admin/              # Admin-only pages
│   │   ├── users/          # User management
│   │   ├── roles/          # Role management
│   │   ├── settings/       # System settings
│   │   ├── analytics/      # Analytics dashboard
│   │   └── audit-log/      # Audit log viewer
│   ├── documents/          # Document management
│   ├── workflows/          # Workflow management
│   ├── projects/           # Project management
│   └── transmittals/       # Transmittal management

actions/
├── admin-users.ts          # Admin user management actions
├── documents.ts            # Document actions
├── workflows.ts            # Workflow actions
├── projects.ts             # Project actions
└── transmittals.ts         # Transmittal actions

components/
├── edms/                   # EDMS-specific components
│   ├── admin-user-edit-sheet.tsx
│   ├── document-compare-dialog.tsx
│   ├── workflow-template-sheet.tsx
│   └── ...
└── ui/                     # Shadcn UI components

lib/
├── edms/                   # EDMS business logic
│   ├── rbac.ts             # Role-based access control
│   ├── session.ts          # Session management
│   ├── notifications.ts    # Notification logic
│   ├── workflow-reminders.ts
│   ├── ocr.ts
│   └── watermark.ts
└── shared.ts               # Shared utilities

db/
├── schema/                 # Database schemas
│   ├── users.ts
│   ├── documents.ts
│   ├── workflows.ts
│   ├── projects.ts
│   └── ...
└── index.ts
```

---

## 🎨 DESIGN GUIDELINES

### Color Scheme
- Use existing Tailwind theme
- Primary: Blue tones for actions
- Success: Green for approvals
- Warning: Amber for pending
- Danger: Red for rejections
- Neutral: Slate for text and borders

### Typography
- Headings: Font semibold
- Body: Font normal
- Labels: Font medium, uppercase, tracking-wide
- Code: Font mono

### Spacing
- Use Tailwind spacing scale (4px increments)
- Consistent padding: p-4, p-6, p-8
- Consistent gaps: gap-4, gap-6, gap-8

### Components
- Use rounded-2xl or rounded-3xl for cards
- Use border-border/70 for subtle borders
- Use bg-card/95 for card backgrounds
- Use shadow-sm for subtle shadows

---

## 🚀 IMPLEMENTATION PRIORITY

### Phase 1: Critical (Do First)
1. ✅ Admin user role editing
2. ✅ Admin user management UI
3. ✅ User detail page
4. ✅ Bulk user operations

### Phase 2: High Priority
5. ✅ Workflow templates
6. ✅ Document templates
7. ✅ Advanced search
8. ✅ Analytics dashboard

### Phase 3: Medium Priority
9. ✅ Project enhancements
10. ✅ Transmittal enhancements
11. ✅ Collaboration features
12. ✅ Mobile optimization

### Phase 4: Nice to Have
13. ✅ AI-powered features
14. ✅ Digital signatures
15. ✅ Document watermarking
16. ✅ Custom branding

---

## 🧪 TESTING CHECKLIST

### Before Marking Complete:

1. **Database**
   - [ ] Run migrations successfully
   - [ ] Verify all tables exist
   - [ ] Test foreign key constraints

2. **User Roles**
   - [ ] Create test users for each role
   - [ ] Verify role hierarchy works
   - [ ] Test permission checks

3. **Document Workflow**
   - [ ] Upload document as Contractor
   - [ ] Create workflow
   - [ ] Review as Client
   - [ ] Approve/Reject
   - [ ] Verify status updates
   - [ ] Check notifications sent

4. **Admin Features**
   - [ ] Edit user role
   - [ ] Deactivate user
   - [ ] View user activity
   - [ ] Export user list

5. **Edge Cases**
   - [ ] Test with no data
   - [ ] Test with large datasets
   - [ ] Test concurrent workflows
   - [ ] Test file upload limits
   - [ ] Test invalid inputs

---

## 📝 DOCUMENTATION REQUIREMENTS

### For Each New Feature:

1. **Code Comments**
   - Explain complex logic
   - Document function parameters
   - Add JSDoc comments for public APIs

2. **README Updates**
   - Add feature to feature list
   - Update setup instructions if needed
   - Add screenshots for UI features

3. **API Documentation**
   - Document new actions
   - Document request/response types
   - Add usage examples

---

## 🎯 SUCCESS CRITERIA

The EDMS is complete when:

1. ✅ Admin can fully manage users (edit roles, deactivate, delete)
2. ✅ All workflows are tested and working
3. ✅ All pages are mobile-responsive
4. ✅ Analytics dashboard shows meaningful data
5. ✅ Search works across all entities
6. ✅ Notifications work reliably
7. ✅ No console errors
8. ✅ No TypeScript errors
9. ✅ All features documented
10. ✅ Client is happy and impressed

---

## 💡 UNIQUE SELLING POINTS TO EMPHASIZE

Make this EDMS stand out by:

1. **AI Integration** - Smart suggestions, auto-categorization
2. **Beautiful UI** - Classy, modern, professional design
3. **Real-time Collaboration** - Live updates, instant notifications
4. **Mobile-First** - Works perfectly on phones and tablets
5. **Customizable** - Branding, workflows, templates
6. **Secure** - Audit logs, 2FA, role-based access
7. **Fast** - Optimized performance, instant search
8. **Intuitive** - Easy to use, minimal training needed
9. **Comprehensive** - All construction document needs in one place
10. **Scalable** - Works for small teams and large enterprises

---

## 🔥 FINAL NOTES

- **Don't break existing features** - Test thoroughly before committing
- **Follow existing patterns** - Look at how similar features are implemented
- **Ask for clarification** - If requirements are unclear, ask the client
- **Prioritize user experience** - Make it easy and delightful to use
- **Think long-term** - Build features that scale and are maintainable
- **Be creative** - Add thoughtful touches that make the EDMS special

---

## 📞 CLIENT EXPECTATIONS

The client wants:
- A **unique** EDMS that stands out from competitors
- A **classy** design that looks professional
- **Complete** features with no half-baked implementations
- **Admin powers** to manage users and system settings
- **Reliable** workflows that construction teams can depend on
- **Mobile access** for field workers
- **Fast** performance with no lag
- **Secure** system with proper access controls

**Budget:** Client is willing to pay extra for quality work
**Timeline:** Complete Phase 1 (Admin features) ASAP, then proceed with other phases

---

## 🎬 GET STARTED

1. Read this entire document
2. Review existing codebase
3. Start with Phase 1 (Admin user management)
4. Test each feature thoroughly
5. Move to next phase
6. Communicate progress regularly
7. Ask questions when needed

**Let's build the best construction EDMS ever! 🚀**
