import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
      getProducts,
      getProductsByType,
      getMaterials,
      getMaterialById,
      getProductById,
      createBudget,
      getBudgetById,
      getUserBudgets,
      createBudgetItem,
      getBudgetItems,
      updateBudgetStatus,
      createProduct,
      updateProduct,
      createMaterial,
      updateMaterial,
      getAllBudgets,
    } from "./db";
    import { generateBudgetPDF } from "./pdf-generator";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import { TRPCError } from "@trpc/server";
import { normalizePhoneNumber, isValidPhoneNumber } from "../shared/phone-utils";
import { sanitizeForHtml } from "../shared/html-utils";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Products and Materials
  catalog: router({
    getProducts: publicProcedure.query(async () => {
      return getProducts();
    }),

    getProductsByType: publicProcedure
      .input(z.enum(["calha", "rufo", "pingadeira"]))
      .query(async ({ input }) => {
        return getProductsByType(input);
      }),

    getMaterials: publicProcedure.query(async () => {
      return getMaterials();
    }),

    getProductDetails: publicProcedure
      .input(z.object({ productId: z.number(), materialId: z.number() }))
      .query(async ({ input }) => {
        const product = await getProductById(input.productId);
        const material = await getMaterialById(input.materialId);
        return { product, material };
      }),
  }),

  // PDF generation
  pdf: router({
    generateBudgetPDF: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const budget = await getBudgetById(input);
        if (!budget) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Budget not found" });
        }

        const items = await getBudgetItems(input);
        const { generateBudgetPDF } = await import("./pdf-generator");

        const html = await generateBudgetPDF({
          id: budget.id,
          clientName: budget.clientName || undefined,
          clientEmail: budget.clientEmail || undefined,
          totalPrice: budget.totalPrice,
          items: items.map((item) => ({
            productName: item.product?.name || "Produto",
            materialName: item.material?.name || "Material",
            squareMeter: item.squareMeter,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
          createdAt: budget.createdAt,
        });

        return { html, budgetId: budget.id };
      }),
  }),

  // Budget calculations and creation
  budget: router({
    calculatePrice: publicProcedure
      .input(
        z.object({
          materialId: z.number().int().positive(),
          length: z.number().positive().finite().max(100000),
          width: z.number().positive().finite().max(100000),
          quantity: z.number().int().positive().max(1000),
        })
      )
      .query(async ({ input }) => {
        const material = await getMaterialById(input.materialId);
        if (!material) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Material not found" });
        }

        // Calculate square meters: (length * width) / 10000 (convert cm² to m²)
        const squareMeter = (input.length * input.width) / 10000;
        const unitPrice = Math.round((squareMeter * material.pricePerSqMeter) / 1);
        const totalPrice = unitPrice * input.quantity;

        return {
          squareMeter: Math.round(squareMeter * 100) / 100,
          unitPrice,
          totalPrice,
          pricePerSqMeter: material.pricePerSqMeter,
        };
      }),

    createBudget: protectedProcedure
      .input(
        z.object({
          clientName: z.string().min(1).max(255).optional(),
          clientEmail: z.string().email().max(320).optional(),
          clientPhone: z.string().refine(
            (phone) => !phone || isValidPhoneNumber(phone),
            "Telefone invalido. Use formato brasileiro (10 ou 11 digitos)"
          ).optional(),
          items: z.array(
            z.object({
              productId: z.number().int().positive(),
              materialId: z.number().int().positive(),
              quantity: z.number().int().positive().max(1000),
              length: z.number().positive().finite().max(100000),
              width: z.number().positive().finite().max(100000),
            })
          ).min(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Calculate total price
        let totalPrice = 0;
        const processedItems = [];

        for (const item of input.items) {
          const material = await getMaterialById(item.materialId);
          if (!material) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Material not found" });
          }

          const squareMeter = (item.length * item.width) / 10000;
          const unitPrice = Math.round((squareMeter * material.pricePerSqMeter) / 1);
          const itemTotalPrice = unitPrice * item.quantity;
          totalPrice += itemTotalPrice;

          processedItems.push({
            ...item,
            squareMeter: Math.round(squareMeter * 10000),
            unitPrice,
            totalPrice: itemTotalPrice,
          });
        }

        // Create budget
        const budgetResult = await createBudget({
          userId: ctx.user.id,
          clientName: input.clientName ? sanitizeForHtml(input.clientName) : undefined,
          clientEmail: input.clientEmail ? sanitizeForHtml(input.clientEmail) : undefined,
          clientPhone: input.clientPhone ? normalizePhoneNumber(input.clientPhone) : undefined,
          totalPrice,
          status: "completed",
        });

        // Get the created budget ID
        const budgetId = (budgetResult as any).insertId;

        // Create budget items
        for (const item of processedItems) {
          await createBudgetItem({
            budgetId,
            productId: item.productId,
            materialId: item.materialId,
            quantity: item.quantity,
            length: item.length,
            width: item.width,
            squareMeter: item.squareMeter,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          });
        }

        // Notify owner
        const phoneInfo = input.clientPhone ? `\nTelefone: ${input.clientPhone}` : "";
        await notifyOwner({
          title: "Novo Orçamento Criado",
          content: `Um novo orçamento foi criado por ${ctx.user.name || "um usuário"}. Total: R$ ${(totalPrice / 100).toFixed(2)}${phoneInfo}`,
        });

        return { budgetId, totalPrice };
      }),

    getBudget: protectedProcedure
      .input(z.number())
      .query(async ({ input, ctx }) => {
        const budget = await getBudgetById(input);
        if (!budget) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Budget not found" });
        }

        // Check if user owns this budget or is admin
        if (budget.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }

        const items = await getBudgetItems(input);
        return { budget, items };
      }),

    listUserBudgets: protectedProcedure.query(async ({ ctx }) => {
      return getUserBudgets(ctx.user.id);
    }),

    generatePdfDescription: publicProcedure
      .input(
        z.object({
          productName: z.string(),
          materialName: z.string(),
          squareMeter: z.number(),
          quantity: z.number(),
        })
      )
      .query(async ({ input }) => {
        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content:
                  "Você é um especialista em orçamentos de calhas e rufos. Gere uma descrição profissional e elegante para um item de orçamento.",
              },
              {
                role: "user",
                content: `Gere uma descrição elegante e profissional para: Produto: ${input.productName}, Material: ${input.materialName}, Área: ${input.squareMeter}m², Quantidade: ${input.quantity} unidades. A descrição deve ser concisa (máximo 2 linhas) e destacar os benefícios do produto.`,
              },
            ],
          });

          const description =
            response.choices[0]?.message?.content || "Descrição não disponível";
          return { description };
        } catch (error) {
          console.error("Error generating description:", error);
          return {
            description: `${input.productName} em ${input.materialName} - ${input.squareMeter}m² x ${input.quantity} unidades`,
          };
        }
      }),
  }),

  // Admin procedures
  admin: router({
    createProduct: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          type: z.enum(["calha", "rufo", "pingadeira"]),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }

        return createProduct(input);
      }),

    updateProduct: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }

        const { id, ...updates } = input;
        return updateProduct(id, updates);
      }),

    createMaterial: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          pricePerSqMeter: z.number(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }

        return createMaterial(input);
      }),

    updateMaterial: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          pricePerSqMeter: z.number().optional(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }

        const { id, ...updates } = input;
        return updateMaterial(id, updates);
      }),

    getAllBudgets: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      return getAllBudgets();
    }),
  }),
});

export type AppRouter = typeof appRouter;
