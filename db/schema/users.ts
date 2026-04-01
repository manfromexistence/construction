import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Extended user table for EDMS
 * This extends the base user table from Better Auth with construction-specific fields
 */
export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: text("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),

  // EDMS-specific fields
  role: varchar("role", { length: 50 }).default("user"),
  // admin, client, pmc, vendor, subcontractor, user
  organization: varchar("organization", { length: 255 }),
  jobTitle: varchar("job_title", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  department: varchar("department", { length: 255 }),
  isActive: text("is_active").default("true"), // true, false
});

// Export the user table as 'users' for consistency with new schema files
export { users as user };
