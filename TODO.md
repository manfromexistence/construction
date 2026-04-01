# Construction EDMS - Development TODO

> Project transformation from theme manager to Electronic Document Management System for construction projects

## Phase 1: Project Setup and Branding [done]

- [x] Rename project to "construction" (completed: 2026-04-01)
- [x] Update package.json with new project details (completed: 2026-04-01)
- [x] Update README.md with Construction EDMS information (completed: 2026-04-01)
- [x] Create CHANGELOG.md for tracking changes (completed: 2026-04-01)
- [ ] Update environment variables and configuration

## Phase 2: Database Schema Design [done]

- [x] Design database schema for EDMS (completed: 2026-04-01)
- [x] Update existing user table with role fields (completed: 2026-04-01)
- [x] Create main schema index file (completed: 2026-04-01)
- [ ] Generate Drizzle migrations
- [ ] Run migrations

## Phase 3: UI Components and Dashboard [done]

- [x] Create app directory structure for EDMS (completed: 2026-04-01)
- [x] Set up main dashboard layout with sidebar (completed: 2026-04-01)
- [x] Create navigation components (completed: 2026-04-01)
- [x] Implement project-wise dashboard (completed: 2026-04-01)
- [x] Create document status summary widgets (completed: 2026-04-01)
- [x] Build activity log component (completed: 2026-04-01)

## Phase 4: Core Modules Development [in progress]

### User Management (Existing - Enhance)
- [ ] Add role selection during registration
- [ ] Add organization/company field
- [ ] Update user profile with construction-specific fields
- [ ] Implement role-based access control middleware

### Project Management Module
- [x] Create project creation page (completed: 2026-04-01)
- [x] Project listing page (completed: 2026-04-01)
- [x] Project details page (completed: 2026-04-01)
- [ ] Assign users to projects
- [ ] Define user roles per project

### Document Control Module
- [ ] Document upload interface
- [ ] File storage integration (Vercel Blob/S3)
- [ ] Document listing with filters
- [ ] Document preview functionality
- [ ] Version control system
- [ ] Document numbering system
- [ ] Metadata management

### Document Workflow Module
- [ ] Submit for review functionality
- [ ] Multi-level review workflow
- [ ] Approve/Reject/Comment interface
- [ ] Document status tracking
- [ ] Comment history view

### Transmittal Module
- [ ] Create transmittal form
- [ ] Attach multiple documents
- [ ] Send to project parties
- [ ] Track acknowledgement

### Search and Filters
- [ ] Global search functionality
- [ ] Advanced filters (discipline, status, revision)
- [ ] Quick document retrieval

### Notifications
- [ ] Email notification system
- [ ] In-app notifications
- [ ] Notification preferences

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
**Last Updated:** 2026-04-01
