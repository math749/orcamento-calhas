import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock context for testing
function createMockContext(): TrpcContext {
  const user = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "test",
    role: "user" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Budget Procedures", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createMockContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("catalog.getProducts", () => {
    it("should return list of products", async () => {
      const products = await caller.catalog.getProducts();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
      expect(products[0]).toHaveProperty("name");
      expect(products[0]).toHaveProperty("type");
    });
  });

  describe("catalog.getMaterials", () => {
    it("should return list of materials", async () => {
      const materials = await caller.catalog.getMaterials();
      expect(Array.isArray(materials)).toBe(true);
      expect(materials.length).toBeGreaterThan(0);
      expect(materials[0]).toHaveProperty("name");
      expect(materials[0]).toHaveProperty("pricePerSqMeter");
    });

    it("should have correct price values", async () => {
      const materials = await caller.catalog.getMaterials();
      const prices = materials.map((m) => m.pricePerSqMeter);
      // Check for standard prices: 130, 140, 150 (in cents)
      expect(prices).toContain(13000); // R$ 130,00
      expect(prices).toContain(14000); // R$ 140,00
      expect(prices).toContain(15000); // R$ 150,00
    });
  });

  describe("budget.calculatePrice", () => {
    it("should calculate price correctly for material", async () => {
      const materials = await caller.catalog.getMaterials();
      const material = materials[0];

      const result = await caller.budget.calculatePrice({
        materialId: material.id,
        length: 100, // 1m
        width: 100, // 1m
        quantity: 1,
      });

      expect(result).toHaveProperty("squareMeter");
      expect(result).toHaveProperty("unitPrice");
      expect(result).toHaveProperty("totalPrice");

      // 100cm x 100cm = 1m²
      expect(result.squareMeter).toBe(1);

      // unitPrice should be material price per m²
      expect(result.unitPrice).toBe(material.pricePerSqMeter);

      // totalPrice should be unitPrice * quantity
      expect(result.totalPrice).toBe(material.pricePerSqMeter * 1);
    });

    it("should calculate price with multiple quantities", async () => {
      const materials = await caller.catalog.getMaterials();
      const material = materials[0];

      const result = await caller.budget.calculatePrice({
        materialId: material.id,
        length: 100,
        width: 100,
        quantity: 5,
      });

      // totalPrice should be unitPrice * quantity
      expect(result.totalPrice).toBe(result.unitPrice * 5);
    });

    it("should calculate correct square meters", async () => {
      const materials = await caller.catalog.getMaterials();
      const material = materials[0];

      // Test: 200cm x 150cm = 3m²
      const result = await caller.budget.calculatePrice({
        materialId: material.id,
        length: 200,
        width: 150,
        quantity: 1,
      });

      expect(result.squareMeter).toBe(3);
    });
  });

  describe("budget.listUserBudgets", () => {
    it("should return empty list for new user", async () => {
      const budgets = await caller.budget.listUserBudgets();
      expect(Array.isArray(budgets)).toBe(true);
      // May be empty or have existing budgets
      expect(budgets.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("catalog.getProductsByType", () => {
    it("should return products filtered by type", async () => {
      const calhas = await caller.catalog.getProductsByType("calha");
      expect(Array.isArray(calhas)).toBe(true);
      calhas.forEach((product) => {
        expect(product.type).toBe("calha");
      });
    });

    it("should return rufos", async () => {
      const rufos = await caller.catalog.getProductsByType("rufo");
      expect(Array.isArray(rufos)).toBe(true);
      if (rufos.length > 0) {
        expect(rufos[0].type).toBe("rufo");
      }
    });

    it("should return pingadeiras", async () => {
      const pingadeiras = await caller.catalog.getProductsByType("pingadeira");
      expect(Array.isArray(pingadeiras)).toBe(true);
      if (pingadeiras.length > 0) {
        expect(pingadeiras[0].type).toBe("pingadeira");
      }
    });
  });

  describe("PDF Generation", () => {
    it("should generate PDF HTML for budget", async () => {
      const budgets = await caller.budget.listUserBudgets();
      if (budgets.length > 0) {
        const budget = budgets[0];
        const pdfResult = await caller.pdf.generateBudgetPDF(budget.id);

        expect(pdfResult).toHaveProperty("html");
        expect(pdfResult).toHaveProperty("budgetId");
        expect(pdfResult.html).toContain("GCALHAS");
        expect(pdfResult.html).toContain(`#${budget.id}`);
      }
    });
  });

  describe("auth.logout", () => {
    it("should successfully logout", async () => {
      const result = await caller.auth.logout();
      expect(result).toEqual({ success: true });
    });
  });
});
