/**
 * Database Schema Index
 * 
 * This file exports all database schemas for the Construction EDMS.
 * Organized by domain for better maintainability.
 */

// Authentication & Users (from Better Auth + EDMS extensions)
export * from "./users";

// EDMS Core Modules
export * from "./projects";
export * from "./documents";
export * from "./workflows";
export * from "./transmittals";
export * from "./notifications";

// Note: The original schema.ts file contains Better Auth tables and theme-related tables
// which are kept for backward compatibility and authentication functionality
