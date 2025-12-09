import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, materials, budgets, budgetItems, InsertProduct, InsertMaterial, InsertBudget, InsertBudgetItem } from "../drizzle/schema";
import { ENV } from './_core/env';

export let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Products and Materials queries
export async function getProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products);
}

export async function getProductsByType(type: 'calha' | 'rufo' | 'pingadeira') {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.type, type));
}

export async function getMaterials() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(materials);
}

export async function getMaterialById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(materials).where(eq(materials.id, id)).limit(1);
  return result[0];
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0];
}

// Budget queries
export async function createBudget(budget: InsertBudget) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const result = await db.insert(budgets).values(budget);
  return result;
}

export async function getBudgetById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(budgets).where(eq(budgets.id, id)).limit(1);
  return result[0];
}

export async function getUserBudgets(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(budgets).where(eq(budgets.userId, userId));
}

export async function createBudgetItem(item: InsertBudgetItem) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const result = await db.insert(budgetItems).values(item);
  return result;
}

export async function getBudgetItems(budgetId: number) {
  const db = await getDb();
  if (!db) return [];
  const items = await db.select().from(budgetItems).where(eq(budgetItems.budgetId, budgetId));
  
  // Enrich items with product and material details
  const enrichedItems = await Promise.all(
    items.map(async (item) => ({
      ...item,
      product: await getProductById(item.productId),
      material: await getMaterialById(item.materialId),
    }))
  );
  
  return enrichedItems;
}

export async function updateBudgetStatus(budgetId: number, status: 'draft' | 'completed' | 'sent') {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.update(budgets).set({ status }).where(eq(budgets.id, budgetId));
}

// Admin queries
export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.insert(products).values(product);
}

export async function updateProduct(id: number, product: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.update(products).set(product).where(eq(products.id, id));
}

export async function createMaterial(material: InsertMaterial) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.insert(materials).values(material);
}

export async function updateMaterial(id: number, material: Partial<InsertMaterial>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.update(materials).set(material).where(eq(materials.id, id));
}

export async function getAllBudgets() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(budgets);
}
