# Construction EDMS - Development TODO

> Project transformation from theme manager to Electronic Document Management System for construction projects

## Phase 1: Project Setup & Branding ✅

- [x] ~~Rename project to "construction"~~ ✅ (completed: 2026-04-01)
- [x] ~~Update package.json with new project details~~ ✅ (completed: 2026-04-01)
- [x] ~~Update README.md with Construction EDMS information~~ ✅ (completed: 2026-04-01)
- [x] ~~Create CHANGELOG.md for tracking changes~~ ✅ (completed: 2026-04-01)
- [ ] Update environment variables and configuration

## Phase 2: Database Schema Design ✅

- [x] ~~Design database schema for EDMS~~ ✅ (completed: 2026-04-01)
  - [x] ~~Projects table~~ ✅
  - [x] ~~Documents table with version control~~ ✅
  - [x] ~~Document metadata fields~~ ✅
  - [x] ~~Workflows table~~ ✅
  - [x] ~~Transmittals table~~ ✅
  - [x] ~~Comments/Reviews table~~ ✅
  - [x] ~~Notifications table~~ ✅
  - [x] ~~User roles and permissions~~ ✅
- [x] ~~Update existing user table with role fields~~ ✅ (completed: 2026-04-01)
- [x] ~~Create main schema index file~~ ✅ (completed: 2026-04-01)
- [ ] Generate Drizzle migrations
- [ ] Run migrations

## Phase 3: UI Components & Dashboard ⏳ In Progress

- [ ] Create app directory structure for EDMS
- [ ] Set up main dashboard layout with sidebar
- [ ] Create navigation components
- [ ] Implement project-wise dashboard
- [ ] Create document status summary widgets
- [ ] Build activity log component

## Phase 4: Core Modules Development

### User Management (Existing - Enhance)
- [ ] Add role selection during registration
- [ ] Add organization/company field
- [ ] Update user profile with construction-specific fields
- [ ] Implement role-based access control middleware

### Project Management Module
- [ ] Create project creation page
- [ ] Project listing page
- [ ] Project details page
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

### Search & Filters
- [ ] Global search functionality
- [ ] Advanced filters (discipline, status, revision)
- [ ] Quick document retrieval

### Notifications
- [ ] Email notification system
- [ ] In-app notifications
- [ ] Notification preferences

## Phase 5: Testing & Refinement

- [ ] Test all user roles and permissions
- [ ] Test document workflows
- [ ] Test file uploads and downloads
- [ ] Performance optimization
- [ ] Security audit
- [ ] UI/UX refinements

## Phase 6: Documentation & Deployment

- [ ] API documentation
- [ ] User guide
- [ ] Admin guide
- [ ] Deployment instructions
- [ ] Environment setup guide

---

## Current Status: Phase 1 - Project Setup
**Last Updated:** 2026-04-01
