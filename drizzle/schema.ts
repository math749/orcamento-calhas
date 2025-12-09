import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Product types: calhas, rufos, pingadeiras
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["calha", "rufo", "pingadeira"]).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// Materials for products
export const materials = mysqlTable("materials", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  pricePerSqMeter: int("pricePerSqMeter").notNull(), // in cents (13000 = R$ 130,00)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Material = typeof materials.$inferSelect;
export type InsertMaterial = typeof materials.$inferInsert;

// Budgets/Orçamentos
export const budgets = mysqlTable("budgets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  clientName: varchar("clientName", { length: 255 }),
  clientEmail: varchar("clientEmail", { length: 320 }),
  totalPrice: int("totalPrice").notNull(), // in cents
  status: mysqlEnum("status", ["draft", "completed", "sent"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Budget = typeof budgets.$inferSelect;
export type InsertBudget = typeof budgets.$inferInsert;

// Budget items - individual products in a budget
export const budgetItems = mysqlTable("budgetItems", {
  id: int("id").autoincrement().primaryKey(),
  budgetId: int("budgetId").notNull(),
  productId: int("productId").notNull(),
  materialId: int("materialId").notNull(),
  quantity: int("quantity").notNull(),
  length: int("length").notNull(), // in cm
  width: int("width").notNull(), // in cm
  squareMeter: int("squareMeter").notNull(), // calculated m² * 10000 for precision
  unitPrice: int("unitPrice").notNull(), // in cents
  totalPrice: int("totalPrice").notNull(), // in cents
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BudgetItem = typeof budgetItems.$inferSelect;
export type InsertBudgetItem = typeof budgetItems.$inferInsert;

// Relations
export const budgetsRelations = relations(budgets, ({ many }) => ({
  items: many(budgetItems),
}));

export const budgetItemsRelations = relations(budgetItems, ({ one }) => ({
  budget: one(budgets, {
    fields: [budgetItems.budgetId],
    references: [budgets.id],
  }),
  product: one(products, {
    fields: [budgetItems.productId],
    references: [products.id],
  }),
  material: one(materials, {
    fields: [budgetItems.materialId],
    references: [materials.id],
  }),
}));