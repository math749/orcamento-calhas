import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Printer, Copy, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import FinancialAnalysis from "@/components/FinancialAnalysis";

export default function BudgetDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const budgetId = parseInt(id || "0");

  const { data: budgetData, isLoading } = trpc.budget.getBudget.useQuery(budgetId);
  const { data: pdfData } = trpc.pdf.generateBudgetPDF.useQuery(budgetId);
  const [copying, setCopying] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!budgetData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-slate-600">Orçamento não encontrado</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { budget, items } = budgetData;
  const totalPrice = budget.totalPrice;

  const handlePrint = () => {
    if (pdfData?.html) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(pdfData.html);
        printWindow.document.close();
        printWindow.addEventListener("load", () => {
          printWindow.print();
        });
      }
    } else {
      window.print();
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setCopying(true);
      if (!pdfData?.html) {
        toast.error("PDF não disponível");
        return;
      }

      // Create a blob from the HTML
      const blob = new Blob([pdfData.html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      
      // Open in new window for printing/saving
      const printWindow = window.open(url, "_blank");
      if (printWindow) {
        printWindow.addEventListener("load", () => {
          printWindow.print();
        });
      }
      
      toast.success("PDF aberto para download/impressão");
    } catch (error) {
      toast.error("Erro ao gerar PDF");
      console.error(error);
    } finally {
      setCopying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4 gap-2">
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-lg mb-6">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle>Orçamento #{budget.id}</CardTitle>
                <CardDescription className="text-blue-100">
                  Criado em {new Date(budget.createdAt).toLocaleDateString("pt-BR")}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {budget.clientName && (
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-slate-600">Cliente</p>
                      <p className="text-lg font-semibold text-slate-900">{budget.clientName}</p>
                    </div>
                    {budget.clientEmail && (
                      <div>
                        <p className="text-sm text-slate-600">Email</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {budget.clientEmail}
                        </p>
                      </div>
                    )}
                    {budget.clientPhone && (
                      <div>
                        <p className="text-sm text-slate-600">Telefone</p>
                        <a
                          href={`https://wa.me/55${budget.clientPhone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-semibold text-green-600 hover:text-green-700 flex items-center gap-2"
                        >
                          <MessageCircle className="w-5 h-5" />
                          {budget.clientPhone}
                        </a>
                      </div>
                    )}
                  </div>
                )}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        budget.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : budget.status === "sent"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {budget.status === "completed"
                        ? "Completo"
                        : budget.status === "sent"
                          ? "Enviado"
                          : "Rascunho"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Itens do Orçamento</CardTitle>
                <CardDescription>{items.length} produtos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold">Produto</th>
                        <th className="text-left py-3 px-4 font-semibold">Material</th>
                        <th className="text-center py-3 px-4 font-semibold">M²</th>
                        <th className="text-center py-3 px-4 font-semibold">Qtd</th>
                        <th className="text-right py-3 px-4 font-semibold">Unitário</th>
                        <th className="text-right py-3 px-4 font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100">
                          <td className="py-3 px-4">{item.product?.name || "Produto"}</td>
                          <td className="py-3 px-4">{item.material?.name || "Material"}</td>
                          <td className="text-center py-3 px-4">
                            {(item.squareMeter / 10000).toFixed(2)}
                          </td>
                          <td className="text-center py-3 px-4">{item.quantity}</td>
                          <td className="text-right py-3 px-4">
                            R$ {(item.unitPrice / 100).toFixed(2)}
                          </td>
                          <td className="text-right py-3 px-4 font-bold text-blue-600">
                            R$ {(item.totalPrice / 100).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Financial Analysis Section */}
            <FinancialAnalysis 
              totalValue={totalPrice / 100} 
              materialCost={0}
            />
          </div>

          <div>
            <Card className="shadow-lg sticky top-24">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-2">Total do Orçamento</p>
                  <p className="text-3xl font-bold text-blue-600">
                    R$ {(totalPrice / 100).toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleDownloadPDF}
                    disabled={copying || !pdfData}
                    className="w-full gap-2"
                  >
                    <Download className="w-5 h-5" />
                    {copying ? "Gerando..." : "Baixar PDF"}
                  </Button>
                  <Button onClick={handlePrint} className="w-full gap-2" variant="outline" disabled={!pdfData}>
                    <Printer className="w-5 h-5" />
                    Imprimir
                  </Button>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copiado!");
                    }}
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <Copy className="w-5 h-5" />
                    Copiar Link
                  </Button>
                  {budget.clientPhone && (
                    <a
                      href={`https://wa.me/55${budget.clientPhone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Enviar via WhatsApp
                    </a>
                  )}
                </div>

                <div className="text-xs text-slate-500 text-center pt-4">
                  Orçamento #{budget.id}
                </div>
                <p className="text-xs text-slate-500 text-center pt-2">
                  💡 Dica: Veja a análise financeira completa abaixo
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
