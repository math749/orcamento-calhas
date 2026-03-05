import { invokeLLM } from "./_core/llm";
import { escapeHtml } from "../shared/html-utils";

interface BudgetItemForPDF {
  productName: string;
  materialName: string;
  squareMeter: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface BudgetForPDF {
  id: number;
  clientName?: string;
  clientEmail?: string;
  totalPrice: number;
  items: BudgetItemForPDF[];
  createdAt: Date;
}

export async function generateBudgetPDF(budget: BudgetForPDF): Promise<string> {
  // Generate HTML that can be printed to PDF
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Orçamento #${budget.id}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 900px; margin: 0 auto; padding: 40px; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #0052CC; padding-bottom: 20px; }
        .logo { font-size: 32px; font-weight: bold; color: #0052CC; margin-bottom: 10px; }
        .title { font-size: 20px; font-weight: bold; color: #333; }
        .info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .info-item { }
        .info-label { font-size: 12px; color: #666; text-transform: uppercase; }
        .info-value { font-size: 14px; font-weight: bold; color: #333; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background-color: #0052CC; color: white; padding: 12px; text-align: left; font-weight: bold; }
        td { padding: 12px; border-bottom: 1px solid #ddd; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .total-section { display: flex; justify-content: flex-end; margin-bottom: 40px; }
        .total-box { width: 300px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd; }
        .total-amount { font-size: 20px; font-weight: bold; color: #0052CC; padding: 12px 0; }
        .footer { text-align: center; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
        .footer-title { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 5px; }
        .footer-subtitle { font-size: 12px; font-style: italic; }
        @media print { body { margin: 0; padding: 0; } .container { padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">GCALHAS</div>
          <div class="title">Orçamento de Calhas, Rufos e Pingadeiras</div>
        </div>

        <div class="info">
          <div class="info-item">
            <div class="info-label">Orçamento</div>
            <div class="info-value">#${budget.id}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Data</div>
            <div class="info-value">${new Date(budget.createdAt).toLocaleDateString("pt-BR")}</div>
          </div>
          ${budget.clientName ? `
          <div class="info-item">
            <div class="info-label">Cliente</div>
            <div class="info-value">${escapeHtml(budget.clientName)}</div>
          </div>
          ` : ''}
          ${budget.clientEmail ? `
          <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value">${escapeHtml(budget.clientEmail)}</div>
          </div>
          ` : ''}
        </div>

        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Material</th>
              <th class="text-center">M²</th>
              <th class="text-center">Qtd</th>
              <th class="text-right">Unitário</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${budget.items.map(item => `
            <tr>
              <td>${escapeHtml(item.productName)}</td>
              <td>${escapeHtml(item.materialName)}</td>
              <td class="text-center">${(item.squareMeter / 10000).toFixed(2)}</td>
              <td class="text-center">${item.quantity}</td>
              <td class="text-right">R$ ${(item.unitPrice / 100).toFixed(2)}</td>
              <td class="text-right">R$ ${(item.totalPrice / 100).toFixed(2)}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-box">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>R$ ${(budget.totalPrice / 100).toFixed(2)}</span>
            </div>
            <div class="total-row" style="border-bottom: 2px solid #0052CC; font-weight: bold; font-size: 16px;">
              <span>TOTAL:</span>
              <span class="total-amount">R$ ${(budget.totalPrice / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <div class="footer-title">Obrigado por escolher a GCALHAS!</div>
          <div class="footer-subtitle">Qualidade e elegância em cada detalhe.</div>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

export async function generateItemDescription(
  productName: string,
  materialName: string,
  squareMeter: number,
  quantity: number
): Promise<string> {
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
          content: `Gere uma descrição elegante e profissional para: Produto: ${productName}, Material: ${materialName}, Área: ${squareMeter.toFixed(2)}m², Quantidade: ${quantity} unidades. A descrição deve ser concisa (máximo 2 linhas) e destacar os benefícios do produto.`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    const description = typeof content === 'string' ? content : "Descrição não disponível";
    return description;
  } catch (error) {
    console.error("Error generating description:", error);
    return `${productName} em ${materialName} - ${squareMeter.toFixed(2)}m² x ${quantity} unidades`;
  }
}
