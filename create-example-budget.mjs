import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { budgets, budgetItems, users } from "./drizzle/schema.js";

const DATABASE_URL = process.env.DATABASE_URL;

async function createExampleBudget() {
  try {
    // Create connection
    const connection = await mysql.createConnection(DATABASE_URL);
    const db = drizzle(connection);

    // Get first user
    const allUsers = await db.select().from(users).limit(1);
    const userId = allUsers[0]?.id || 1;

    // Create example budget
    const budgetResult = await db.insert(budgets).values({
      userId,
      clientName: "João Silva - Residência",
      clientEmail: "joao@example.com",
      clientPhone: "(11) 99999-8888",
      totalPrice: 350000, // R$ 3.500,00 em centavos
      status: "completed",
      description: "Orçamento de calhas e rufos para residência",
    });

    const budgetId = budgetResult[0];
    console.log(`✅ Orçamento criado com ID: ${budgetId}`);

    // Create example budget items
    const items = [
      {
        budgetId: budgetId,
        productId: 1,
        materialId: 1,
        quantity: 1,
        squareMeter: 5000,
        unitPrice: 15000,
        totalPrice: 75000,
      },
      {
        budgetId: budgetId,
        productId: 2,
        materialId: 2,
        quantity: 2,
        squareMeter: 3000,
        unitPrice: 14000,
        totalPrice: 84000,
      },
      {
        budgetId: budgetId,
        productId: 3,
        materialId: 1,
        quantity: 1,
        squareMeter: 2000,
        unitPrice: 13000,
        totalPrice: 26000,
      },
    ];

    for (const item of items) {
      await db.insert(budgetItems).values(item);
    }

    console.log(`✅ ${items.length} itens adicionados ao orçamento`);
    console.log("\n📊 Resumo do Orçamento de Exemplo:");
    console.log("==================================");
    console.log(`ID do Orçamento: ${budgetId}`);
    console.log(`Cliente: João Silva - Residência`);
    console.log(`Telefone: (11) 99999-8888`);
    console.log(`Valor Total: R$ 3.500,00`);
    console.log(`Itens: 3 produtos`);
    console.log("\n💰 Análise Financeira (cálculos automáticos):");
    console.log("==================================");
    
    const totalValue = 3500;
    const materialCost = 800;
    
    let remaining = totalValue;
    const material = materialCost;
    remaining -= material;
    
    const gcalhas = remaining * 0.3;
    remaining -= gcalhas;
    
    const car = remaining * 0.3;
    remaining -= car;
    
    const nildo = remaining * 0.27;
    remaining -= nildo;
    
    const matheus = remaining * 0.25;
    remaining -= matheus;
    
    const cashbox = remaining;
    
    console.log(`Valor do Serviço: R$ ${totalValue.toFixed(2)}`);
    console.log(`- Custo do Material: R$ ${material.toFixed(2)}`);
    console.log(`- GCALHAS (30%): R$ ${gcalhas.toFixed(2)}`);
    console.log(`- Carro (30%): R$ ${car.toFixed(2)}`);
    console.log(`- Nildo (27%): R$ ${nildo.toFixed(2)}`);
    console.log(`- Matheus (25%): R$ ${matheus.toFixed(2)}`);
    console.log(`= Caixa da Empresa: R$ ${cashbox.toFixed(2)}`);
    console.log("\n✅ Orçamento de exemplo criado com sucesso!");

    await connection.end();
  } catch (error) {
    console.error("❌ Erro:", error.message);
    process.exit(1);
  }
}

createExampleBudget();
