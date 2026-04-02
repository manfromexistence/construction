# QUADRA - Development TODO

> Project transformation from theme manager to Electronic Document Management System for construction projects

## Phase 1: Project Setup and Branding [done]

- [x] Rename project to "construction" (completed: 2026-04-01)
- [x] Update package.json with new project details (completed: 2026-04-01)
- [x] Update README.md with QUADRA information (completed: 2026-04-01)
- [x] Create CHANGELOG.md for tracking changes (completed: 2026-04-01)
- [ ] Update environment variables and configuration
  Direct upload still needs `BLOB_READ_WRITE_TOKEN`, and production email should set `RESEND_FROM_EMAIL`.

## Phase 2: Database Schema Design [done]

- [x] Design database schema for EDMS (completed: 2026-04-01)
- [x] Update existing user table with role fields (completed: 2026-04-01)
- [x] Create main schema index file (completed: 2026-04-01)
- [x] Generate Drizzle migrations (completed: 2026-04-01)
- [x] Run migrations (completed: 2026-04-01)

## Phase 3: UI Components and Dashboard [done]

- [x] Create app directory structure for EDMS (completed: 2026-04-01)
- [x] Set up main dashboard layout with sidebar (completed: 2026-04-01)
- [x] Create navigation components (completed: 2026-04-01)
- [x] Implement project-wise dashboard (completed: 2026-04-01)
- [x] Create document status summary widgets (completed: 2026-04-01)
- [x] Build activity log component (completed: 2026-04-01)

## Phase 4: Core Modules Development [in progress]

### User Management (Existing - Enhance)
- [x] Add role selection during registration/profile management (completed: 2026-04-01)
- [x] Add organization/company field (completed: 2026-04-01)
- [x] Update user profile with construction-specific fields (completed: 2026-04-01)
- [ ] Implement role-based access control middleware

### Project Management Module
- [x] Create project creation page (completed: 2026-04-01)
- [x] Project listing page (completed: 2026-04-01)
- [x] Project details page (completed: 2026-04-01)
- [x] Assign users to projects (completed: 2026-04-01)
- [x] Define user roles per project (completed: 2026-04-01)

### Document Control Module
- [x] Document upload interface (completed: 2026-04-01)
- [x] File storage integration (Vercel Blob upload flow with external URL fallback, completed: 2026-04-01)
- [x] Document listing with filters (completed: 2026-04-01)
- [x] Document preview functionality (completed: 2026-04-01)
- [x] Version control system (completed: 2026-04-01)
- [x] Document numbering system (completed: 2026-04-01)
- [x] Metadata management (completed: 2026-04-01)

### Document Workflow Module
- [x] Submit for review functionality (completed: 2026-04-01)
- [x] Multi-level review workflow (completed: 2026-04-01)
- [x] Approve/Reject/Comment interface (completed: 2026-04-01)
- [x] Document status tracking (completed: 2026-04-01)
- [x] Comment history view (completed: 2026-04-01)

### Transmittal Module
- [x] Create transmittal form (completed: 2026-04-01)
- [x] Attach multiple documents (completed: 2026-04-01)
- [x] Send to project parties (completed: 2026-04-01)
- [x] Track acknowledgement (completed: 2026-04-01)

### Search and Filters
- [x] Global search functionality (completed: 2026-04-01)
- [x] Advanced filters (discipline, status, revision) (completed: 2026-04-01)
- [x] Quick document retrieval (completed: 2026-04-01)

### Notifications
- [x] Email notification system (completed: 2026-04-01)
- [x] In-app notifications (completed: 2026-04-01)
- [x] Notification preferences (completed: 2026-04-01)

## Phase 5: Testing and Refinement

- [ ] Test all user roles and permissions
- [ ] Test document workflows
- [ ] Test file uploads and downloads
- [ ] Performance optimization
- [ ] Security audit
- [ ] UI/UX refinements

## Phase 6: Documentation and Deployment

- [ ] API documentation
- [ ] User guide
- [ ] Admin guide
- [ ] Deployment instructions
- [ ] Environment setup guide

---

## Current Status: Phase 4 - Core Modules Development
Active work now covers dashboard operations, route-level onboarding enforcement, role-aware module controls, project creation/detail, project member assignment, document control registration/filtering/detail preview/versioning/numbering, direct Blob-backed upload flow with URL fallback, workflow routing plus review decisions, transmittal issue/acknowledgement handling, account profile management, notification preferences, in-app alerts, global EDMS search, and Resend-backed outbound delivery. The biggest remaining MVP gaps are final deployment environment setup for Blob/email sender identity and optional deeper auth-time onboarding capture.
**Last Updated:** 2026-04-01
